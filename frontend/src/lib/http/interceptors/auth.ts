import type { InternalAxiosRequestConfig } from "axios";

// Retrieves current token from storage
const getAuthToken = (): string | null => {
  // TODO: Implement actual token retrieval
  // Example: return localStorage.getItem('auth_token');
  return null;
};

export const authInterceptor = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const token = getAuthToken();

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`; // only in case we use Bearer tokens
  }

  return config;
};
