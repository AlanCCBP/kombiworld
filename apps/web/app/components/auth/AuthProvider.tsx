'use client';

import { useEffect, useState } from 'react';
import { sessionStore } from '@/lib/auth/sessionStore';

const USERS_API = process.env.NEXT_PUBLIC_USERS_API!;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function hydrate() {
      try {
        const res = await fetch(`${USERS_API}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });

        if (res.ok) {
          const { accessToken } = await res.json();
          sessionStore.setAccessToken(accessToken);
        }
      } catch {
        sessionStore.clear();
      } finally {
        setReady(true);
      }
    }

    hydrate();
  }, []);

  if (!ready) return null;

  return <>{children}</>;
}
