'use client';

import { useState, useTransition, useEffect } from 'react';
import { submitVote, getRandomUnvotedCaption, getCaptionById } from '../captions/actions';

type Caption = {
  id: string;
  created_datetime_utc: string;
  content: string;
  is_public: boolean;
  profile_id: string;
  image_id: string;
  is_featured: boolean;
  like_count: number;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
  } | null;
  images: {
    url: string | null;
    image_description: string | null;
  } | null;
  voteScore: number;
  userVote: number | null;
};

type HistoryItem = {
  caption: Caption;
  voteValue: number | null;
};

type CaptionVotingInterfaceProps = {
  initialCaption: Caption | null;
};

type FloatEmoji = { key: number; emoji: string };

export default function CaptionVotingInterface({ initialCaption }: CaptionVotingInterfaceProps) {
  const [history, setHistory] = useState<HistoryItem[]>(
    initialCaption ? [{ caption: initialCaption, voteValue: initialCaption.userVote }] : []
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [preloadedCaption, setPreloadedCaption] = useState<Caption | null>(null);
  const [isPreloading, setIsPreloading] = useState(false);

  // Animation states
  const [upBounce, setUpBounce] = useState(false);
  const [downBounce, setDownBounce] = useState(false);
  const [floatEmoji, setFloatEmoji] = useState<FloatEmoji | null>(null);

  const currentItem = history[currentIndex];
  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < history.length - 1;
  const isAtEnd = currentIndex === history.length - 1;

  // Preload next caption when at the end of history
  useEffect(() => {
    const preloadNext = async () => {
      if (isAtEnd && !preloadedCaption && !isPreloading) {
        setIsPreloading(true);
        try {
          const result = await getRandomUnvotedCaption();
          if (result.caption) setPreloadedCaption(result.caption);
        } catch (err) {
          console.error('Preload error:', err);
        } finally {
          setIsPreloading(false);
        }
      }
    };
    preloadNext();
  }, [currentIndex, history.length, isAtEnd, preloadedCaption, isPreloading]);

  const triggerVoteAnimation = (voteValue: 1 | -1) => {
    if (voteValue === 1) {
      setUpBounce(true);
      setTimeout(() => setUpBounce(false), 450);
      setFloatEmoji({ key: Date.now(), emoji: '😂' });
    } else {
      setDownBounce(true);
      setTimeout(() => setDownBounce(false), 450);
      setFloatEmoji({ key: Date.now(), emoji: '😑' });
    }
    setTimeout(() => setFloatEmoji(null), 800);
  };

  const handleVote = async (voteValue: 1 | -1) => {
    if (!currentItem) return;

    setError(null);
    const previousVote = currentItem.voteValue;
    const newVote = previousVote === voteValue ? null : voteValue;

    // Always animate on click (feels responsive)
    triggerVoteAnimation(voteValue);

    const newHistory = [...history];
    newHistory[currentIndex] = { ...currentItem, voteValue: newVote };
    setHistory(newHistory);

    startTransition(async () => {
      const result = await submitVote(currentItem.caption.id, voteValue);

      if (!result.success) {
        setError(result.error || 'Failed to submit vote');
        const revertHistory = [...history];
        revertHistory[currentIndex] = { ...currentItem, voteValue: previousVote };
        setHistory(revertHistory);
        return;
      }

      if (currentIndex === history.length - 1) {
        await loadNextCaption();
      }
    });
  };

  const loadNextCaption = async () => {
    setIsLoadingNext(true);
    setError(null);

    try {
      let nextCaption: Caption | null = null;

      if (preloadedCaption) {
        nextCaption = preloadedCaption;
        setPreloadedCaption(null);
      } else {
        const result = await getRandomUnvotedCaption();
        if (result.error || !result.caption) {
          setError(result.error || 'No more captions available');
          setIsLoadingNext(false);
          return;
        }
        nextCaption = result.caption;
      }

      setHistory(prev => [...prev, { caption: nextCaption!, voteValue: null }]);
      setCurrentIndex(prev => prev + 1);

      setTimeout(async () => {
        try {
          const result = await getRandomUnvotedCaption();
          if (result.caption) setPreloadedCaption(result.caption);
        } catch (err) {
          console.error('Background preload error:', err);
        }
      }, 100);
    } catch {
      setError('Failed to load next caption');
    } finally {
      setIsLoadingNext(false);
    }
  };

  const goBack = () => {
    if (!canGoBack) return;
    setError(null);
    setCurrentIndex(prev => prev - 1);
  };

  const goForward = () => {
    if (!canGoForward) return;
    setError(null);
    setCurrentIndex(prev => prev + 1);
  };

  const skipCaption = async () => {
    if (currentIndex === history.length - 1) {
      await loadNextCaption();
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (!currentItem) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-6">
        <div className="text-6xl animate-wiggle">😴</div>
        <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
          No captions available right now.
        </p>
        <button
          onClick={loadNextCaption}
          className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 active:scale-95 transition-all shadow-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { caption, voteValue } = currentItem;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl animate-pop-in">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Caption card */}
      <div className="rounded-2xl overflow-hidden shadow-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">

        {/* Image area */}
        {caption.images?.url && (
          <div
            className="relative w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden"
            style={{ height: '500px' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={caption.images.url}
              alt={caption.images.image_description || 'Caption image'}
              className="w-full h-full object-contain transition-opacity duration-300"
            />
            {caption.is_featured && (
              <span className="absolute top-3 right-3 px-3 py-1 text-xs font-bold bg-yellow-400 text-yellow-900 rounded-full shadow-md">
                ⭐ Featured
              </span>
            )}
          </div>
        )}

        <div className="p-6 space-y-5">
          {/* Caption text */}
          <div className="relative rounded-xl bg-gray-50 dark:bg-gray-800/60 p-4 border border-gray-100 dark:border-gray-700" style={{ minHeight: '100px' }}>
            <span className="absolute -top-3 left-4 text-3xl leading-none text-blue-300 dark:text-blue-500 select-none">"</span>
            <div className="overflow-y-auto pl-2" style={{ maxHeight: '80px' }}>
              <p className="text-lg text-gray-900 dark:text-white font-medium leading-relaxed">
                {caption.content || '(No caption text)'}
              </p>
            </div>
            <span className="absolute -bottom-3 right-4 text-3xl leading-none text-blue-300 dark:text-blue-500 select-none">"</span>
          </div>

          {/* Vote buttons */}
          <div className="relative flex items-center justify-center gap-6 py-2">
            {/* Floating emoji burst */}
            {floatEmoji && (
              <div
                key={floatEmoji.key}
                className="absolute top-0 left-1/2 -translate-x-1/2 text-5xl pointer-events-none z-20 animate-float-up"
              >
                {floatEmoji.emoji}
              </div>
            )}

            {/* Downvote */}
            <button
              onClick={() => handleVote(-1)}
              disabled={isPending || isLoadingNext}
              className={`vote-btn vote-btn-down flex flex-col items-center gap-2 px-6 py-4 rounded-2xl w-32 font-semibold text-base transition-all
                ${voteValue === -1
                  ? 'selected bg-red-500 text-white scale-105'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500'
                }
                ${downBounce ? 'animate-vote-shake' : ''}
                disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              <span className="text-2xl">{voteValue === -1 ? '😑' : '👎'}</span>
              <span>Not funny</span>
            </button>

            {/* Upvote */}
            <button
              onClick={() => handleVote(1)}
              disabled={isPending || isLoadingNext}
              className={`vote-btn vote-btn-up flex flex-col items-center gap-2 px-6 py-4 rounded-2xl w-32 font-semibold text-base transition-all
                ${voteValue === 1
                  ? 'selected bg-green-500 text-white scale-105'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/30 hover:text-green-500'
                }
                ${upBounce ? 'animate-vote-bounce' : ''}
                disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              <span className="text-2xl">{voteValue === 1 ? '😂' : '👍'}</span>
              <span>LOL!</span>
            </button>
          </div>

          {/* Navigation bar */}
          <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={goBack}
              disabled={!canGoBack || isPending || isLoadingNext}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Previous
            </button>

            {/* Counter */}
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {currentIndex + 1} / {history.length}
              </span>
              {voteValue !== null && (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  you voted {voteValue === 1 ? '😂 funny' : '😑 meh'}
                </span>
              )}
            </div>

            {canGoForward ? (
              <button
                onClick={goForward}
                disabled={isPending || isLoadingNext}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            ) : (
              <button
                onClick={skipCaption}
                disabled={isPending || isLoadingNext}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                {isLoadingNext ? '⏳ Loading…' : 'Skip →'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer hint */}
      <div className="mt-5 text-center text-sm text-gray-400 dark:text-gray-500 space-y-1">
        <p>Vote and the next caption loads automatically. You can always go back.</p>
        {isPreloading && (
          <p className="text-xs text-blue-400 dark:text-blue-500">⏳ Preloading next one…</p>
        )}
        {preloadedCaption && !isPreloading && (
          <p className="text-xs text-green-500 dark:text-green-400">✓ Next caption is ready!</p>
        )}
      </div>
    </div>
  );
}
