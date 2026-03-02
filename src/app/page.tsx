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
    <main className="flex min-h-screen items-center justify-center bg-[--background] font-sans dark:bg-[--background]">
      <div className="flex min-h-screen w-full max-w-full flex-col items-center justify-between py-32 px-16 bg-[--background] dark:bg-[--background] sm:items-start">
        {!user ? (
          <>
            <PageHeader />
            <div className="w-full text-center py-12">
              <div className="max-w-2xl mx-auto space-y-6">
                <h2 className="glow-text text-3xl font-bold text-gray-900 dark:text-white">
                  Where captions go to be judged. 😂
                </h2>
                <p className="text-lg text-gray-500 dark:text-gray-400">
                  Sign in with Google to start voting — or upload your own images for the AI to roast.
                </p>
                <div className="pt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    No comedy degree required.
                  </p>
                </div>
              </div>
            </div>
            <div></div>
          </>
        ) : (
          <>
            <div className="w-full flex justify-end items-center gap-3">
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
                  <h1 className="glow-text text-4xl font-bold text-gray-900 dark:text-white mb-3">
                    Welcome back, {userProfile?.first_name || userProfile?.last_name
                      ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim()
                      : user.email}! 👋
                  </h1>
                  <p className="text-lg text-gray-500 dark:text-gray-400">
                    Your daily dose of caption comedy awaits.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mt-12">
                  <Link
                    href="/upload"
                    className="humor-card group p-8 border-2 border-amber-200 dark:border-gray-700 rounded-2xl hover:border-green-500 dark:hover:border-green-500 bg-amber-100 dark:bg-gray-900"
                  >
                    <div className="text-5xl mb-4 group-hover:animate-[wiggle_0.4s_ease-in-out]">📸</div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-500 transition-colors">
                      Upload & Generate
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                      Drop a photo — let the AI roast it with captions
                    </p>
                  </Link>

                  <Link
                    href="/captions"
                    className="humor-card group p-8 border-2 border-amber-200 dark:border-gray-700 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 bg-amber-100 dark:bg-gray-900"
                  >
                    <div className="text-5xl mb-4">😂</div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors">
                      Vote on Captions
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                      Funny or not funny? The internet needs your verdict
                    </p>
                  </Link>

                  <Link
                    href="/voted-history"
                    className="humor-card group p-8 border-2 border-amber-200 dark:border-gray-700 rounded-2xl hover:border-purple-500 dark:hover:border-purple-500 bg-amber-100 dark:bg-gray-900"
                  >
                    <div className="text-5xl mb-4">📜</div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-500 transition-colors">
                      Voting History
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                      Revisit every joke you blessed — or cursed
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