"use client";

import { useAuth } from "@/contexts/authContext";
import { useBootstrap } from "@/hooks/useBootstrap";

export function AppBootstrap({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  useBootstrap();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span>Loading KombiWorld…</span>
      </div>
    );
  }

  return <>{children}</>;
}
