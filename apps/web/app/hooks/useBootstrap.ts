"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/authContext";
import { useCompany } from "@/contexts/companyContext";
import { apiClient } from "@/lib/api.client";

export function useBootstrap() {
  const { setUser, loading, user } = useAuth();
  const { setCompanies, setActiveCompany } = useCompany();

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const [meRes, companiesRes] = await Promise.all([
          apiClient.get("/users/me"),
          apiClient.get("/companies/my"),
        ]);

        if (cancelled) return;

        const me = meRes.data;
        const companies = companiesRes.data;

        setUser(me);
        setCompanies(companies);

        if (companies.length === 1) {
          setActiveCompany(companies[0]);
        }
      } catch (err) {
        setUser(null);
        window.location.href = "/login";
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);
}
