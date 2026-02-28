'use client';

import { useState, useTransition } from 'react';
import { submitVote } from '../captions/actions';

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

type VotedHistoryItemProps = {
  caption: Caption;
};

export default function VotedHistoryItem({ caption: initialCaption }: VotedHistoryItemProps) {
  const [userVote, setUserVote] = useState<number | null>(initialCaption.userVote);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleVote = async (voteValue: 1 | -1) => {
    const oldVote = userVote;
    
    // Optimistic update
    if (oldVote === voteValue) {
      setUserVote(null); // Toggle off
    } else {
      setUserVote(voteValue); // Change vote
    }
    
    setError(null);

    startTransition(async () => {
      const result = await submitVote(initialCaption.id, voteValue);
      
      if (!result.success) {
        // Revert on error
        setUserVote(oldVote);
        setError(result.error || 'Failed to update vote');
        setTimeout(() => setError(null), 3000);
      }
    });
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-gray-900">
      {initialCaption.images?.url && (
        <div className="relative w-full bg-gray-100 dark:bg-gray-800" style={{ height: '200px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={initialCaption.images.url}
            alt={initialCaption.images.image_description || 'Caption image'}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-4">
        <div className="mb-3" style={{ minHeight: '60px' }}>
          <p className="text-sm text-gray-900 dark:text-white line-clamp-3">
            {initialCaption.content || '(No caption text)'}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-2">
          <button
            onClick={() => handleVote(1)}
            disabled={isPending}
            className={`flex items-center gap-1 px-3 py-2 rounded transition-all flex-1 justify-center ${
              userVote === 1
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-semibold">Up</span>
          </button>

          <button
            onClick={() => handleVote(-1)}
            disabled={isPending}
            className={`flex items-center gap-1 px-3 py-2 rounded transition-all flex-1 justify-center ${
              userVote === -1
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-semibold">Down</span>
          </button>
        </div>

        {error && (
          <p className="text-xs text-red-500 dark:text-red-400 text-center mt-1">
            {error}
          </p>
        )}

        {initialCaption.is_featured && (
          <div className="mt-2 text-center">
            <span className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded">
              ⭐ Featured
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
