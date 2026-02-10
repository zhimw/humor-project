import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import CaptionExamplesTable from '../components/CaptionExamplesTable';
import Link from 'next/link';
import { logout } from './actions';

type CaptionExample = {
  id: number;
  created_datetime_utc: string;
  modified_datetime_utc: string | null;
  image_description: string;
  caption: string;
  explanation: string;
  priority: number;
  image_id: string | null;
};

export default async function GatedPage() {
  const supabase = await createClient();

  // Use getUser() instead of getSession() for security
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/'); // Not logged in? Go home.
  }

  // Fetch caption examples
  let caption_examples: CaptionExample[] | null = null;
  let fetchError: string | null = null;

  try {
    const { data, error } = await supabase
      .from('caption_examples')
      .select('*')
      .order('id');

    if (error) {
      throw error;
    }
    caption_examples = data;
  } catch (error: any) {
    console.error('Error fetching caption examples:', error);
    fetchError = 'Could not fetch caption examples. Please try again later.';
  }

  if (fetchError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <div className="text-center">
          <p className="text-2xl font-semibold text-red-500">Error</p>
          <p className="text-gray-500">{fetchError}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex min-h-screen w-full max-w-full flex-col gap-8 py-16 px-8 bg-white dark:bg-black">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
                🔓 Caption Examples
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Welcome, {user.email}
              </p>
            </div>
            <div className="flex gap-4">
              <Link 
                href="/"
                className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                ← Back to Home
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

        <CaptionExamplesTable initialData={caption_examples || []} />
      </div>
    </main>
  );
}
