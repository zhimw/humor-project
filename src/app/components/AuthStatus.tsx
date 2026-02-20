"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import type { Session } from "@supabase/supabase-js";
import Link from "next/link";

export default function AuthStatus() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
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

  if (loading) {
    return null;
  }

  if (session) {
    const handleLogout = async () => {
      await supabase.auth.signOut();
    };

    return (
      <div className="text-sm text-gray-700 dark:text-gray-300">
        <p>Signed in as {session.user.email}.</p>
        <div className="flex gap-4 mt-2">
          <Link href="/captions" className="text-blue-500 hover:underline">
            Vote on Captions
          </Link>
          <Link href="/voted-history" className="text-blue-500 hover:underline">
            Voting History
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="mt-3 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    );
  }

  return null;
}
