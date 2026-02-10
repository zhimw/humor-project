'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const LoginButton = dynamic(() => import('./LoginButton'), { ssr: false });
const AuthStatus = dynamic(() => import('./AuthStatus'), { ssr: false });

export default function PageHeader() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
      <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
        Humor project starter
      </h1>
      {isMounted && (
        <>
          <LoginButton />
          <AuthStatus />
        </>
      )}
    </div>
  );
}
