import type { InternalAxiosRequestConfig } from "axios";

// TODO: adapt this file to our project needs,
//  we don't use Bearer, we have refreshToken in cookies and we use with credentials: include

// Retrieves current token from storage
const getAuthToken = (): string | null => {
  // TODO: Implement actual token retrieval
  // Example: return localStorage.getItem('refreshToken'); or const hasSession = localStorage.getItem("hasSession");
  return null;
};

export const authInterceptor = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const token = getAuthToken();

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};
