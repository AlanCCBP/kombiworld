"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
          fetch("/api/users/me", {
            credentials: "include",
          }),
          fetch("/api/users/companies/my", {
            credentials: "include",
          }),
        ]);

        if (!meRes.ok || !companiesRes.ok) {
          throw new Error("Unauthorized");
        }

        const me = await meRes.json();
        const companies = await companiesRes.json();

        if (cancelled) return;

        setUser(me);
        setCompanies(companies);

        const storedCompanyId = localStorage.getItem("activeCompanyId");

        if (storedCompanyId) {
          const match = companies.find((c: any) => c.id === storedCompanyId);
          if (match) {
            setActiveCompany(match);
            return;
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
