import PageHeader from './components/PageHeader';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { logout } from './actions';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let userProfile = null;
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('first_name, last_name, email')
      .eq('id', user.id)
      .single();
    userProfile = data;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex min-h-screen w-full max-w-full flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        {!user ? (
          <>
            <PageHeader />
            <div className="w-full text-center py-12">
              <div className="max-w-2xl mx-auto space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Welcome to the Humor Project
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Sign in with your Google account to start voting on captions.
                </p>
                <div className="pt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Once logged in, you'll be able to vote on humorous captions and view your voting history.
                  </p>
                </div>
              </div>
            </div>
            <div></div>
          </>
        ) : (
          <>
            <div className="w-full flex justify-end">
              <form action={logout}>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </form>
            </div>

            <div className="w-full text-center flex-1 flex items-center justify-center">
              <div className="max-w-3xl mx-auto space-y-8">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Welcome back, {userProfile?.first_name || userProfile?.last_name 
                      ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim()
                      : user.email}!
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    What would you like to do today?
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-12">
                  <Link
                    href="/captions"
                    className="group p-8 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xl transition-all bg-white dark:bg-gray-900"
                  >
                    <div className="text-5xl mb-4">📝</div>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-500">
                      Vote on Captions
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      View random captions with images and vote on your favorites
                    </p>
                  </Link>

                  <Link
                    href="/voted-history"
                    className="group p-8 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-xl transition-all bg-white dark:bg-gray-900"
                  >
                    <div className="text-5xl mb-4">📊</div>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-purple-500">
                      Voting History
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      See all the captions you've voted on
                    </p>
                  </Link>
                </div>
              </div>
            </div>

            <div></div>
          </>
        )}
      </div>
    </main>
  );
}