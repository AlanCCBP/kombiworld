"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface Company {
  id: string;
  name: string;
}

interface CompanyContextType {
  company: Company | null;
  setCompany: (company: Company) => void;
}

const CompanyContext = createContext<CompanyContextType | null>(null);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [company, setCompanyState] = useState<Company | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("activeCompany");
    if (stored) {
      setCompanyState(JSON.parse(stored));
    }
  }, []);

  const setCompany = (company: Company) => {
    setCompanyState(company);
    localStorage.setItem("activeCompany", JSON.stringify(company));
  };

  return (
    <CompanyContext.Provider value={{ company, setCompany }}>{children}</CompanyContext.Provider>
  );
}

export function useCompany() {
  const ctx = useContext(CompanyContext);
  if (!ctx) {
    throw new Error("useCompany must be used within CompanyProvider");
  }
  return ctx;
}
