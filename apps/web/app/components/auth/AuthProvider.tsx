"use client";

import { useEffect, useState } from "react";
import { sessionStore } from "@/lib/auth/sessionStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function hydrate() {
      try {
        const res = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });

        if (res.ok) {
          const { accessToken } = await res.json();
          sessionStore.setAccessToken(accessToken);
        } else {
          sessionStore.clear();
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
