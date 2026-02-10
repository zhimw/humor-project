"use client";

import { createBrowserClient } from '@supabase/ssr';
import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';

export default function LoginButton() {
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    setRedirectUrl(`${window.location.origin}/auth/callback`);

    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleLogin = async () => {
    if (!redirectUrl) return;

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: false,
      },
    });
  };

  // Don't show button if loading or if user is already logged in
  if (loading || session) {
    return null;
  }

  return (
    <button
      onClick={handleLogin}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-5 text-white transition-colors hover:bg-blue-700 md:w-auto"
      disabled={!redirectUrl}
    >
      Sign in with Google
    </button>
  );
}
