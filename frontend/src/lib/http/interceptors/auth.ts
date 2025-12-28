import type { InternalAxiosRequestConfig } from "axios";

/**
 * Auth interceptor for axios requests
 * 
 * Note: This project uses refresh token in HTTP-only cookies for authentication.
 * The backend validates the refresh token from cookies, NOT from Authorization headers.
 * Therefore, we don't need to add any Authorization header here.
 * 
 * Authentication is handled automatically by:
 * - withCredentials: true (includes cookies in requests)
 * - Backend middleware that reads req.cookies.refreshToken
 */
export const authInterceptor = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  // No modifications needed - cookies are sent automatically with withCredentials: true
  return config;
};
