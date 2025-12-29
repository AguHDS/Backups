type ValidationError = { msg: string };

type StorageDetails = {
  used: number;
  limit: number;
  attempted: number;
  remaining: number;
};

type ApiError = {
  message?: string;
  error?: string;
  code?: string;
  details?: StorageDetails;
  errors?: string[] | ValidationError[];
};

type AxiosErrorResponse = {
  response?: {
    data?: ApiError;
  };
  message?: string;
};

type FetchError = Error | ValidationError[] | ApiError | AxiosErrorResponse | unknown;

/**
 * Processes API error messages
 * Can be used along with ValidationMessages component
 */
export const processErrorMessages = (error: FetchError): string[] => {
  // Handle AxiosError structure (error.response.data)
  if (typeof error === "object" && error !== null && "response" in error) {
    const axiosError = error as AxiosErrorResponse;
    if (axiosError.response?.data) {
      const apiError = axiosError.response.data;

      // Check for "error" field first (from backend middlewares)
      if (apiError.error) {
        return [String(apiError.error)];
      }

      // Storage quota exceeded
      if (apiError.code === "STORAGE_QUOTA_EXCEEDED" && apiError.details) {
        const details = apiError.details;
        return [
          "Storage quota exceeded",
          `Used: ${(details.used / (1024 * 1024)).toFixed(2)}MB / Limit: ${(
            details.limit /
            (1024 * 1024)
          ).toFixed(2)}MB`,
          `Attempted to upload: ${(details.attempted / (1024 * 1024)).toFixed(
            2
          )}MB`,
          `Remaining: ${(details.remaining / (1024 * 1024)).toFixed(2)}MB`,
        ];
      }

      // Check for "message" field
      if (apiError.message) {
        if (
          apiError.message.includes("only can have one section") ||
          apiError.message.includes("User role only can have one section")
        ) {
          return ["Users with 'user' role can only have one section"];
        }

        if (apiError.message.includes("Admin users can have up to")) {
          return [apiError.message];
        }

        return [String(apiError.message)];
      }

      // Check for errors array
      if (apiError.errors && Array.isArray(apiError.errors)) {
        return apiError.errors.map((err) =>
          typeof err === "string" ? err : err.msg || String(err)
        );
      }

      // Check for code
      if (apiError.code && apiError.code !== "INTERNAL_SERVER_ERROR") {
        return [`Error: ${apiError.code}`];
      }
    }
  }

  if (Array.isArray(error)) {
    return error.map((err: ValidationError | string) =>
      typeof err === "string" ? err : err.msg
    );
  }

  if (typeof error === "object" && error !== null) {
    const apiError = error as ApiError;

    if (
      apiError.message?.includes("only can have one section") ||
      apiError.message?.includes("User role only can have one section")
    ) {
      return ["Users with 'user' role can only have one section"];
    }

    if (apiError.message?.includes("Admin users can have up to")) {
      return [apiError.message];
    }

    if (apiError.code === "STORAGE_QUOTA_EXCEEDED" && apiError.details) {
      const details = apiError.details;
      return [
        "Storage quota exceeded",
        `Used: ${(details.used / (1024 * 1024)).toFixed(2)}MB / Limit: ${(
          details.limit /
          (1024 * 1024)
        ).toFixed(2)}MB`,
        `Attempted to upload: ${(details.attempted / (1024 * 1024)).toFixed(
          2
        )}MB`,
        `Remaining: ${(details.remaining / (1024 * 1024)).toFixed(2)}MB`,
      ];
    }

    if (apiError.error) {
      return [String(apiError.error)];
    }

    if (apiError.errors && Array.isArray(apiError.errors)) {
      return apiError.errors.map((err) =>
        typeof err === "string" ? err : err.msg || String(err)
      );
    }

    if (apiError.message) {
      return [String(apiError.message)];
    }

    if (apiError.code && apiError.code !== "INTERNAL_SERVER_ERROR") {
      return [`Error: ${apiError.code}`];
    }
  }

  if (error instanceof Error) {
    const errorMessage = error.message;
    
    if (
      errorMessage.includes("only can have one section") ||
      errorMessage.includes("User role only can have one section")
    ) {
      return ["Users with 'user' role can only have one section"];
    }
    
    return [errorMessage];
  }

  if (typeof error === "string") {
    return [error];
  }

  return ["An unexpected error occurred"];
};