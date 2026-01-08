"use client";

import React, { createContext, useContext, useState } from "react";

export type Company = {
  id: string;
  name: string;
  role: "OWNER" | "ADMIN" | "DRIVER" | "STAFF";
};

type CompanyContextType = {
  companies: Company[];
  activeCompany: Company | null;
  setCompanies: (companies: Company[]) => void;
  setActiveCompany: (company: Company) => void;
  clearActiveCompany: () => void;
};

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activeCompany, setActiveCompanyState] = useState<Company | null>(null);

  const setActiveCompany = (company: Company) => {
    setActiveCompanyState(company);
    if (typeof window !== "undefined") {
      localStorage.setItem("activeCompanyId", company.id);
    }
  };

  const clearActiveCompany = () => {
    setActiveCompanyState(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("activeCompanyId");
    }
  };

  return (
    <CompanyContext.Provider
      value={{
        companies,
        activeCompany,
        setCompanies,
        setActiveCompany,
        clearActiveCompany,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const ctx = useContext(CompanyContext);
  if (!ctx) {
    throw new Error("useCompany must be used within CompanyProvider");
  }
  return ctx;
}
