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
          if (result.caption) {
            setPreloadedCaption(result.caption);
          }
        } catch (err) {
          console.error('Preload error:', err);
        } finally {
          setIsPreloading(false);
        }
      }
    };

    preloadNext();
  }, [currentIndex, history.length, isAtEnd, preloadedCaption, isPreloading]);

  const handleVote = async (voteValue: 1 | -1) => {
    if (!currentItem) return;

    setError(null);
    const previousVote = currentItem.voteValue;

    // Update current item's vote in history
    const newHistory = [...history];
    newHistory[currentIndex] = {
      ...currentItem,
      voteValue: previousVote === voteValue ? null : voteValue
    };
    setHistory(newHistory);

    startTransition(async () => {
      const result = await submitVote(currentItem.caption.id, voteValue);

      if (!result.success) {
        setError(result.error || 'Failed to submit vote');
        // Revert the vote change
        const revertHistory = [...history];
        revertHistory[currentIndex] = {
          ...currentItem,
          voteValue: previousVote
        };
        setHistory(revertHistory);
        return;
      }

      // Vote successful! Now load next caption if we're at the end of history
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

      // Use preloaded caption if available
      if (preloadedCaption) {
        nextCaption = preloadedCaption;
        setPreloadedCaption(null);
      } else {
        // Otherwise fetch a new one
        const result = await getRandomUnvotedCaption();
        if (result.error || !result.caption) {
          setError(result.error || 'No more captions available');
          setIsLoadingNext(false);
          return;
        }
        nextCaption = result.caption;
      }

      // Add new caption to history
      setHistory(prev => [...prev, { caption: nextCaption!, voteValue: null }]);
      setCurrentIndex(prev => prev + 1);
      
      // Immediately start preloading the next caption in background
      setTimeout(async () => {
        try {
          const result = await getRandomUnvotedCaption();
          if (result.caption) {
            setPreloadedCaption(result.caption);
          }
        } catch (err) {
          console.error('Background preload error:', err);
        }
      }, 100);
    } catch (err: any) {
      setError('Failed to load next caption');
    } finally {
      setIsLoadingNext(false);
    }
  };

  const goBack = async () => {
    if (!canGoBack) return;
    
    setError(null);
    setCurrentIndex(prev => prev - 1);
  };

  const goForward = async () => {
    if (!canGoForward) return;
    
    setError(null);
    setCurrentIndex(prev => prev + 1);
  };

  const skipCaption = async () => {
    if (currentIndex === history.length - 1) {
      // We're at the end, load a new caption
      await loadNextCaption();
    } else {
      // Move to next in history
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (!currentItem) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          No captions available to vote on.
        </p>
        <button
          onClick={loadNextCaption}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Load First Caption
        </button>
      </div>
    );
  }

  const { caption, voteValue } = currentItem;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-900">
        {caption.images?.url && (
          <div className="relative w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center" style={{ height: '500px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={caption.images.url}
              alt={caption.images.image_description || 'Caption image'}
              className="w-full h-full object-contain"
            />
          </div>
        )}

        <div className="p-6">
          <div className="mb-4" style={{ minHeight: '100px' }}>
            {caption.is_featured && (
              <span className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded mb-2">
                ⭐ Featured
              </span>
            )}
            <div className="overflow-y-auto" style={{ maxHeight: '80px' }}>
              <p className="text-lg text-gray-900 dark:text-white font-medium">
                {caption.content || '(No caption text)'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 mb-4">
            <button
              onClick={() => handleVote(-1)}
              disabled={isPending || isLoadingNext}
              className={`flex flex-col items-center gap-2 px-6 py-4 rounded-lg transition-all w-32 ${
                voteValue === -1
                  ? 'bg-red-500 text-white scale-105'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-base font-semibold">Downvote</span>
            </button>

            <button
              onClick={() => handleVote(1)}
              disabled={isPending || isLoadingNext}
              className={`flex flex-col items-center gap-2 px-6 py-4 rounded-lg transition-all w-32 ${
                voteValue === 1
                  ? 'bg-green-500 text-white scale-105'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-base font-semibold">Upvote</span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={goBack}
              disabled={!canGoBack || isPending || isLoadingNext}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Previous
            </button>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              {currentIndex + 1} / {history.length}
              {voteValue && (
                <span className="ml-2 text-xs">
                  (voted: {voteValue === 1 ? '👍' : '👎'})
                </span>
              )}
            </div>

            {canGoForward ? (
              <button
                onClick={goForward}
                disabled={isPending || isLoadingNext}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            ) : (
              <button
                onClick={skipCaption}
                disabled={isPending || isLoadingNext}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingNext ? 'Loading...' : 'Skip'}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Vote on this caption, and the next one will appear automatically!</p>
        <p className="mt-1">You can always go back to change your previous votes.</p>
        {isPreloading && (
          <p className="mt-2 text-xs text-blue-500 dark:text-blue-400">
            ⏳ Preloading next caption...
          </p>
        )}
        {preloadedCaption && (
          <p className="mt-2 text-xs text-green-500 dark:text-green-400">
            ✓ Next caption ready!
          </p>
        )}
      </div>
    </div>
  );
}
