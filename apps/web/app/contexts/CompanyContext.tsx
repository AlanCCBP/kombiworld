"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { apiClient } from "@/lib/api.client";
import { useAuth } from "@/contexts/authContext";

export type Company = {
  id: string;
  name: string;
};

type CompanyContextType = {
  companies: Company[];
  activeCompany: Company | null;
  setActiveCompany: (c: Company) => void;
  loading: boolean;
};

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [activeCompany, setActiveCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCompanies([]);
      setActiveCompany(null);
      setLoading(false);
      return;
    }

    const loadCompanies = async () => {
      try {
        const { data } = await apiClient.get<{ companies: Company[] }>("/companies/my");

        setCompanies(data.companies ?? []);

        if (data.companies?.length === 1) {
          setActiveCompany(data.companies[0]);
        }
      } catch {
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, [user]);

  return (
    <CompanyContext.Provider value={{ companies, activeCompany, setActiveCompany, loading }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const ctx = useContext(CompanyContext);
  if (!ctx) {
    throw new Error("useCompany must be used inside CompanyProvider");
  }
  return ctx;
}
