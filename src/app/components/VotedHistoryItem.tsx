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
  voteTimestamp?: string;
};

type VotedHistoryItemProps = {
  caption: Caption;
};

export default function VotedHistoryItem({ caption: initialCaption }: VotedHistoryItemProps) {
  const [userVote, setUserVote] = useState<number | null>(initialCaption.userVote);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [upBounce, setUpBounce] = useState(false);
  const [downBounce, setDownBounce] = useState(false);

  const handleVote = async (voteValue: 1 | -1) => {
    const oldVote = userVote;

    if (voteValue === 1) {
      setUpBounce(true);
      setTimeout(() => setUpBounce(false), 450);
    } else {
      setDownBounce(true);
      setTimeout(() => setDownBounce(false), 450);
    }

    setUserVote(oldVote === voteValue ? null : voteValue);
    setError(null);

    startTransition(async () => {
      const result = await submitVote(initialCaption.id, voteValue);
      if (!result.success) {
        setUserVote(oldVote);
        setError(result.error || 'Failed to update vote');
        setTimeout(() => setError(null), 3000);
      }
    });
  };

  return (
    <div className="humor-card border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
      {/* Image */}
      {initialCaption.images?.url && (
        <div className="relative w-full bg-gray-100 dark:bg-gray-800 overflow-hidden" style={{ height: '200px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={initialCaption.images.url}
            alt={initialCaption.images.image_description || 'Caption image'}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {initialCaption.is_featured && (
            <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-bold bg-yellow-400 text-yellow-900 rounded-full shadow">
              ⭐
            </span>
          )}
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* Caption text */}
        <div style={{ minHeight: '60px' }}>
          <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-3 leading-relaxed">
            {initialCaption.content || '(No caption text)'}
          </p>
        </div>

        {/* Vote buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleVote(1)}
            disabled={isPending}
            className={`vote-btn vote-btn-up flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold flex-1 justify-center transition-all
              ${userVote === 1
                ? 'selected bg-green-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/30 hover:text-green-600'
              }
              ${upBounce ? 'animate-vote-bounce' : ''}
              disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <span>{userVote === 1 ? '😂' : '👍'}</span>
            <span>Funny</span>
          </button>

          <button
            onClick={() => handleVote(-1)}
            disabled={isPending}
            className={`vote-btn vote-btn-down flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold flex-1 justify-center transition-all
              ${userVote === -1
                ? 'selected bg-red-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600'
              }
              ${downBounce ? 'animate-vote-shake' : ''}
              disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <span>{userVote === -1 ? '😑' : '👎'}</span>
            <span>Meh</span>
          </button>
        </div>

        {error && (
          <p className="text-xs text-red-500 dark:text-red-400 text-center">{error}</p>
        )}

        {initialCaption.voteTimestamp && (
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            {new Date(initialCaption.voteTimestamp).toLocaleString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })}
          </p>
        )}
      </div>
    </div>
  );
}
