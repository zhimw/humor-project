import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getVotedCaptionHistory } from '../captions/actions';
import Link from 'next/link';
import { logout } from '../actions';
import VotedHistoryGrid from '../components/VotedHistoryGrid';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function VotedHistoryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/');
  }

  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  const historyData = await getVotedCaptionHistory(currentPage, 20);

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex min-h-screen w-full max-w-7xl flex-col gap-8 py-16 px-8 bg-white dark:bg-black">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
                📊 Your Voting History
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {historyData.totalCount > 0 
                  ? `You've voted on ${historyData.totalCount} caption${historyData.totalCount === 1 ? '' : 's'}`
                  : 'No votes yet'}
              </p>
            </div>
            <div className="flex gap-4">
              <Link 
                href="/captions"
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Vote on Captions
              </Link>
              <Link 
                href="/"
                className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                ← Home
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>

        {historyData.error ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {historyData.error}
            </p>
            <Link 
              href="/captions"
              className="mt-4 inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Start Voting
            </Link>
          </div>
        ) : (
          <VotedHistoryGrid 
            captions={historyData.captions}
            currentPage={historyData.currentPage}
            totalPages={historyData.totalPages}
            totalCount={historyData.totalCount}
          />
        )}
      </div>
    </main>
  );
}
