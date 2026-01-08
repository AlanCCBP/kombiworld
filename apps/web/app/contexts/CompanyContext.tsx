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
  setCompanies: (c: Company[]) => void;
  setActiveCompany: (c: Company) => void;
};

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activeCompany, setActiveCompany] = useState<Company | null>(null);

  return (
    <CompanyContext.Provider value={{ companies, activeCompany, setCompanies, setActiveCompany }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error("useCompany must be used inside CompanyProvider");
  return ctx;
}
