'use client';

import Link from 'next/link';
import VotedHistoryItem from './VotedHistoryItem';

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

type VotedHistoryGridProps = {
  captions: Caption[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
};

export default function VotedHistoryGrid({ 
  captions, 
  currentPage, 
  totalPages,
  totalCount 
}: VotedHistoryGridProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {captions.map((caption) => (
          <VotedHistoryItem key={caption.id} caption={caption} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          {currentPage > 1 && (
            <Link
              href={`/voted-history?page=${currentPage - 1}`}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              ← Previous
            </Link>
          )}
          
          <span className="text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          
          {currentPage < totalPages && (
            <Link
              href={`/voted-history?page=${currentPage + 1}`}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
