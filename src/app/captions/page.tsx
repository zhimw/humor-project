import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import CaptionVotingInterface from '../components/CaptionVotingInterface';
import Link from 'next/link';
import { logout } from '../actions';
import { getRandomUnvotedCaption } from './actions';

export default async function CaptionsPage() {
  const supabase = await createClient();

  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/'); // Not logged in? Go home.
  }

  // Fetch first random unvoted caption
  const { caption: initialCaption, error: fetchError } = await getRandomUnvotedCaption();

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex min-h-screen w-full max-w-6xl flex-col gap-8 py-16 px-8 bg-white dark:bg-black">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
                📝 Vote on Captions
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Welcome, {user.email}
              </p>
            </div>
            <div className="flex gap-4">
              <Link 
                href="/voted-history"
                className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Voting History
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

        {fetchError ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {fetchError}
            </p>
          </div>
        ) : (
          <CaptionVotingInterface initialCaption={initialCaption} />
        )}
      </div>
    </main>
  );
}
