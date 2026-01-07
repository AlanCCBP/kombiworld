import { ACTIVE_COMPANY_KEY } from "./constants";
import { ActiveCompany } from "./types";

export function getActiveCompany(): ActiveCompany | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(ACTIVE_COMPANY_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as ActiveCompany;
  } catch {
    return null;
  }
}

export function setActiveCompany(company: ActiveCompany): void {
  localStorage.setItem(ACTIVE_COMPANY_KEY, JSON.stringify(company));
}

export function clearActiveCompany(): void {
  localStorage.removeItem(ACTIVE_COMPANY_KEY);
}
