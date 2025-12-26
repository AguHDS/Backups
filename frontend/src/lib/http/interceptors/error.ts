import type { AxiosError } from "axios";

interface ErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
}

// Think if processErrorMessage & ValidationMessages should be replaced for this:
const getErrorMessage = (error: AxiosError<ErrorResponse>): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  if (error.response?.status) {
    switch (error.response.status) {
      case 400:
        return "Invalid request. Please check your input.";
      case 401:
        return "Authentication required. Please log in.";
      case 403:
        return "You don't have permission to access this resource.";
      case 404:
        return "The requested resource was not found.";
      case 408:
        return "Request timeout. Please try again.";
      case 429:
        return "Too many requests. Please slow down.";
      case 500:
        return "Server error. Please try again later.";
      case 502:
        return "Bad gateway. The server is temporarily unavailable.";
      case 503:
        return "Service unavailable. Please try again later.";
      default:
        return `Request failed with status ${error.response.status}`;
    }
  }

  if (error.code === "ECONNABORTED") {
    return "Request timeout. Please check your connection.";
  }

  if (error.code === "ERR_NETWORK") {
    return "Network error. Please check your internet connection.";
  }

  return error.message || "An unexpected error occurred";
};

// Handles all error responses globally
export const errorInterceptor = (error: AxiosError<ErrorResponse>) => {
  const message = getErrorMessage(error);

  // Log error details log (for development)
  console.error("DEBUG: API Error:", {
    url: error.config?.url,
    method: error.config?.method,
    status: error.response?.status,
    message,
    data: error.response?.data,
  });

  const enhancedError = {
    ...error,
    userMessage: message,
  };

  // TODO: Future integration points
  // - Show toast notification for critical errors
  // - Trigger logout on 401 errors
  // - Retry logic for specific error types

  return Promise.reject(enhancedError);
};
