import type { InternalAxiosRequestConfig } from "axios";

/**
 * Auth interceptor for axios requests
 * 
 * Note: This project uses BetterAuth with HTTP-only session cookies for authentication.
 * The backend validates session cookies automatically, NOT from Authorization headers.
 * Therefore, we don't need to add any Authorization header here.
 * 
 * Authentication is handled automatically by:
 * - withCredentials: true (configured globally in axiosClient)
 * - Backend middleware that validates BetterAuth session via cookies
 */
export const authInterceptor = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  // No modifications needed - cookies are sent automatically with withCredentials: true
  return config;
};
