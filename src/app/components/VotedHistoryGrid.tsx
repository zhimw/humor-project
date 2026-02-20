'use client';

import Link from 'next/link';

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
          <div
            key={caption.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-gray-900"
          >
            {caption.images?.url && (
              <div className="relative w-full bg-gray-100 dark:bg-gray-800" style={{ height: '200px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={caption.images.url}
                  alt={caption.images.image_description || 'Caption image'}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-4">
              <div className="mb-3" style={{ minHeight: '60px' }}>
                <p className="text-sm text-gray-900 dark:text-white line-clamp-3">
                  {caption.content || '(No caption text)'}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="flex items-center gap-2">
                  {caption.userVote === 1 ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full text-xs font-semibold flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      Upvoted
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-full text-xs font-semibold flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Downvoted
                    </span>
                  )}
                </div>
                
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Score: {caption.voteScore}
                </span>
              </div>

              {caption.is_featured && (
                <div className="mt-2">
                  <span className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded">
                    ⭐ Featured
                  </span>
                </div>
              )}
            </div>
          </div>
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
