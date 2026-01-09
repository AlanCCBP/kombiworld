"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { apiClient } from "@/lib/api.client";
import { useRouter } from "next/navigation";

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  globalRole: "USER" | "ADMIN";
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  setUser: (u: AuthUser | null) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data } = await apiClient.get<AuthUser>("/me");
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch {
    } finally {
      setUser(null);
      setLoading(false);
      router.replace("/");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
