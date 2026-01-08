"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api.client";
import { useAuth } from "@/contexts/authContext";
import { useCompany } from "@/contexts/companyContext";

export function useBootstrap() {
  const router = useRouter();
  const { setUser } = useAuth();
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

        if (typeof window !== "undefined") {
          const storedCompanyId = localStorage.getItem("activeCompanyId");

          if (storedCompanyId) {
            const match = companies.find((c: any) => c.id === storedCompanyId);

            if (match) {
              setActiveCompany(match);
              return;
            }
          }
        }

        if (companies.length === 1) {
          setActiveCompany(companies[0]);
        }
      } catch (err) {
        setUser(null);
        router.replace("/login");
      }
    }

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);
}
