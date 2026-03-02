'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { generatePresignedUrl, registerImageUrl, generateCaptions } from './actions';
import type { GeneratedCaption } from './actions';

type Step = 'idle' | 'uploading' | 'registering' | 'generating' | 'done' | 'error';

const SUPPORTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/heic'];

const STEP_LABELS: Record<Step, string> = {
  idle: '',
  uploading: 'Uploading image...',
  registering: 'Registering image...',
  generating: 'Generating captions (this may take ~30s)...',
  done: 'Done!',
  error: 'Something went wrong.',
};

export default function UploadPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<Step>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [captions, setCaptions] = useState<GeneratedCaption[]>([]);
  const [cdnUrl, setCdnUrl] = useState<string>('');

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!SUPPORTED_TYPES.includes(selected.type)) {
      setErrorMsg(`Unsupported file type: ${selected.type}. Please use JPEG, PNG, WebP, GIF, or HEIC.`);
      setStep('error');
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setStep('idle');
    setErrorMsg('');
    setCaptions([]);
    setCdnUrl('');
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (!dropped) return;

    const fakeEvent = { target: { files: e.dataTransfer.files } } as unknown as React.ChangeEvent<HTMLInputElement>;
    handleFileChange(fakeEvent);
  }

  async function handleUpload() {
    if (!file) return;

    setErrorMsg('');
    setCaptions([]);
    setCdnUrl('');

    // Step 1: Get presigned URL
    setStep('uploading');
    const { presignedUrl, cdnUrl: cdn, error: presignedError } = await generatePresignedUrl(file.type);
    if (presignedError || !presignedUrl) {
      setErrorMsg(presignedError || 'Failed to get upload URL');
      setStep('error');
      return;
    }

    // Step 2: PUT file bytes directly to S3 presigned URL
    try {
      const putRes = await fetch(presignedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      if (!putRes.ok) {
        setErrorMsg(`S3 upload failed (${putRes.status})`);
        setStep('error');
        return;
      }
    } catch (err) {
      setErrorMsg('Network error while uploading image.');
      setStep('error');
      return;
    }

    setCdnUrl(cdn);

    // Step 3: Register image URL
    setStep('registering');
    const { imageId, error: registerError } = await registerImageUrl(cdn);
    if (registerError || !imageId) {
      setErrorMsg(registerError || 'Failed to register image');
      setStep('error');
      return;
    }

    // Step 4: Generate captions
    setStep('generating');
    const { captions: generated, error: captionError } = await generateCaptions(imageId);
    if (captionError) {
      setErrorMsg(captionError);
      setStep('error');
      return;
    }

    setCaptions(generated);
    setStep('done');
  }

  const isProcessing = step === 'uploading' || step === 'registering' || step === 'generating';

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-blue-500 hover:underline">
            ← Back
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Upload an Image
          </h1>
          <div />
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-center">
          Upload a photo and our AI will generate funny captions for it.
        </p>

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-10 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors bg-white dark:bg-gray-900"
        >
          <input
            ref={inputRef}
            type="file"
            accept={SUPPORTED_TYPES.join(',')}
            className="hidden"
            onChange={handleFileChange}
          />

          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="max-h-72 rounded-xl object-contain"
            />
          ) : (
            <div className="text-center space-y-3 pointer-events-none">
              <div className="text-6xl">🖼️</div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Drag & drop or <span className="text-blue-500 font-medium">click to browse</span>
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                JPEG, PNG, WebP, GIF, HEIC
              </p>
            </div>
          )}
        </div>

        {/* Change image button when a file is selected */}
        {file && !isProcessing && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
              {file.name}
            </p>
            <button
              onClick={() => inputRef.current?.click()}
              className="text-sm text-blue-500 hover:underline"
            >
              Change image
            </button>
          </div>
        )}

        {/* Upload button */}
        {file && (
          <button
            onClick={handleUpload}
            disabled={isProcessing}
            className="w-full py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-800 transition-colors"
          >
            {isProcessing ? STEP_LABELS[step] : 'Generate Captions'}
          </button>
        )}

        {/* Progress indicator */}
        {isProcessing && (
          <div className="flex flex-col items-center gap-4 py-4">
            <ProgressSteps step={step} />
          </div>
        )}

        {/* Error */}
        {step === 'error' && (
          <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-red-700 dark:text-red-400 text-sm">
            {errorMsg}
          </div>
        )}

        {/* Results */}
        {step === 'done' && captions.length > 0 && (
          <CaptionResults captions={captions} imageUrl={cdnUrl} />
        )}

        {step === 'done' && captions.length === 0 && (
          <div className="rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 text-yellow-700 dark:text-yellow-400 text-sm text-center">
            No captions were returned. Try a different image.
          </div>
        )}
      </div>
    </main>
  );
}

function ProgressSteps({ step }: { step: Step }) {
  const steps: { key: Step; label: string }[] = [
    { key: 'uploading', label: 'Upload' },
    { key: 'registering', label: 'Register' },
    { key: 'generating', label: 'Generate' },
  ];

  const order: Step[] = ['uploading', 'registering', 'generating'];
  const currentIdx = order.indexOf(step);

  return (
    <div className="flex items-center gap-3">
      {steps.map(({ key, label }, idx) => {
        const done = idx < currentIdx;
        const active = idx === currentIdx;
        return (
          <div key={key} className="flex items-center gap-3">
            <div className={`flex items-center gap-2`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                ${done ? 'bg-green-500 text-white' : active ? 'bg-blue-500 text-white animate-pulse' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                {done ? '✓' : idx + 1}
              </div>
              <span className={`text-sm font-medium ${active ? 'text-blue-600 dark:text-blue-400' : done ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`w-8 h-0.5 ${done ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-700'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function CaptionResults({ captions, imageUrl }: { captions: GeneratedCaption[]; imageUrl: string }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center">
        Generated Captions
      </h2>

      {imageUrl && (
        <img
          src={imageUrl}
          alt="Uploaded"
          className="w-full max-h-64 object-contain rounded-xl border border-gray-200 dark:border-gray-700"
        />
      )}

      <div className="space-y-3">
        {captions.map((caption, idx) => (
          <div
            key={caption.id ?? idx}
            className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
              Caption {idx + 1}
            </span>
            <p className="mt-1 text-gray-800 dark:text-gray-200 text-base leading-relaxed">
              {caption.content}
            </p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link
          href="/captions"
          className="inline-block mt-2 text-sm text-blue-500 hover:underline"
        >
          Go vote on captions →
        </Link>
      </div>
    </div>
  );
}
