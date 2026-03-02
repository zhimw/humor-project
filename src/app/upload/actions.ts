'use server';

import { createClient } from '@/lib/supabase/server';

/**
 * Step 1: Generate a presigned S3 upload URL from the caption pipeline API.
 */
export async function generatePresignedUrl(contentType: string): Promise<{
  presignedUrl: string;
  cdnUrl: string;
  error?: string;
}> {
  const supabase = await createClient();
  const { data: { session }, error: authError } = await supabase.auth.getSession();

  if (authError || !session) {
    return { presignedUrl: '', cdnUrl: '', error: 'You must be logged in' };
  }

  const res = await fetch('https://api.almostcrackd.ai/pipeline/generate-presigned-url', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ contentType }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Presigned URL error:', res.status, text);
    return { presignedUrl: '', cdnUrl: '', error: `Failed to generate upload URL (${res.status})` };
  }

  const data = await res.json();
  return { presignedUrl: data.presignedUrl, cdnUrl: data.cdnUrl };
}

/**
 * Step 3: Register the uploaded CDN URL with the pipeline.
 */
export async function registerImageUrl(cdnUrl: string): Promise<{
  imageId: string;
  error?: string;
}> {
  const supabase = await createClient();
  const { data: { session }, error: authError } = await supabase.auth.getSession();

  if (authError || !session) {
    return { imageId: '', error: 'You must be logged in' };
  }

  const res = await fetch('https://api.almostcrackd.ai/pipeline/upload-image-from-url', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageUrl: cdnUrl, isCommonUse: false }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Register image error:', res.status, text);
    return { imageId: '', error: `Failed to register image (${res.status})` };
  }

  const data = await res.json();
  return { imageId: data.imageId };
}

/**
 * Step 4: Trigger caption generation for the registered image.
 */
export async function generateCaptions(imageId: string): Promise<{
  captions: GeneratedCaption[];
  error?: string;
}> {
  const supabase = await createClient();
  const { data: { session }, error: authError } = await supabase.auth.getSession();

  if (authError || !session) {
    return { captions: [], error: 'You must be logged in' };
  }

  const res = await fetch('https://api.almostcrackd.ai/pipeline/generate-captions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageId }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Generate captions error:', res.status, text);
    return { captions: [], error: `Failed to generate captions (${res.status})` };
  }

  const data = await res.json();
  const captions = Array.isArray(data) ? data : [data];
  return { captions };
}

export type GeneratedCaption = {
  id?: string;
  content: string;
  [key: string]: unknown;
};
