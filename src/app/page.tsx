
import PageHeader from './components/PageHeader';

export default async function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex min-h-screen w-full max-w-full flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <PageHeader />

        <div className="w-full text-center py-12">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Welcome to the Humor Project
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Sign in with your Google account to access the caption examples database.
            </p>
            <div className="pt-4">
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Once logged in, you'll be able to view and explore our collection of humorous captions and their explanations.
              </p>
            </div>
          </div>
        </div>

        <div></div>
      </div>
    </main>
  );
}