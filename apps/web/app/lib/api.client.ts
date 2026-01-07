import axios, { InternalAxiosRequestConfig } from "axios";
import { ActiveCompany } from "./types";
import { getActiveCompany } from "./helpers";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL + "/api/users",
  withCredentials: true,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const company: ActiveCompany | null = getActiveCompany();

  if (company) {
    config.headers.set("X-Company-Id", company.id);
  }

  return config;
});
