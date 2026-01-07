import { ActiveCompany } from "@/types/activeCompany";

const STORAGE_KEY = "activeCompany";

export function getActiveCompany(): ActiveCompany | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as ActiveCompany;
  } catch {
    return null;
  }
}

export function setActiveCompany(company: ActiveCompany): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(company));
}

export function clearActiveCompany(): void {
  localStorage.removeItem(STORAGE_KEY);
}
