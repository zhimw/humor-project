'use client';

import { useState, useTransition } from 'react';
import { submitVote } from '../captions/actions';

type VoteButtonProps = {
  captionId: string;
  initialVoteValue: number | null;
  initialVoteScore: number;
  isAuthenticated: boolean;
};

export default function VoteButton({ 
  captionId, 
  initialVoteValue, 
  initialVoteScore,
  isAuthenticated 
}: VoteButtonProps) {
  const [userVote, setUserVote] = useState<number | null>(initialVoteValue);
  const [voteScore, setVoteScore] = useState(initialVoteScore);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleVote = async (voteValue: 1 | -1) => {
    if (!isAuthenticated) {
      setError('Please log in to vote');
      setTimeout(() => setError(null), 3000);
      return;
    }

    // Optimistic UI update
    const oldVote = userVote;
    const oldScore = voteScore;
    
    // Calculate new score based on vote change
    let scoreDelta = 0;
    if (oldVote === null) {
      // New vote
      scoreDelta = voteValue;
      setUserVote(voteValue);
    } else if (oldVote === voteValue) {
      // Removing vote (toggle off)
      scoreDelta = -voteValue;
      setUserVote(null);
    } else {
      // Changing vote from up to down or vice versa
      scoreDelta = voteValue * 2; // -1 to +1 is +2, +1 to -1 is -2
      setUserVote(voteValue);
    }
    
    setVoteScore(oldScore + scoreDelta);
    setError(null);

    startTransition(async () => {
      const result = await submitVote(captionId, voteValue);
      
      if (!result.success) {
        // Revert optimistic update on error
        setUserVote(oldVote);
        setVoteScore(oldScore);
        setError(result.error || 'Failed to submit vote');
        setTimeout(() => setError(null), 3000);
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => handleVote(1)}
          disabled={isPending || !isAuthenticated}
          className={`p-2 rounded transition-colors ${
            userVote === 1
              ? 'bg-green-500 text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title={!isAuthenticated ? 'Log in to vote' : 'Upvote'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        
        <span className="px-2 min-w-[2rem] text-center font-semibold text-gray-900 dark:text-white">
          {voteScore}
        </span>
        
        <button
          onClick={() => handleVote(-1)}
          disabled={isPending || !isAuthenticated}
          className={`p-2 rounded transition-colors ${
            userVote === -1
              ? 'bg-red-500 text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title={!isAuthenticated ? 'Log in to vote' : 'Downvote'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      
      {error && (
        <span className="text-xs text-red-500 dark:text-red-400">
          {error}
        </span>
      )}
    </div>
  );
}
