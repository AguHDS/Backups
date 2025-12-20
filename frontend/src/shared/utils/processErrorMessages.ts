type ValidationError = { msg: string };
type ApiError = {
  message?: string;
  error?: string;
  code?: string;
  details?: any;
  errors?: string[] | ValidationError[];
};
type FetchError = Error | ValidationError[] | ApiError | unknown;

/**
 * Processes API error messages
 * Can be used along with ValidationMessages component
 */
export const processErrorMessages = (error: FetchError): string[] => {
  if (Array.isArray(error)) {
    return error.map((err: ValidationError | string) =>
      typeof err === "string" ? err : err.msg
    );
  }

  if (typeof error === "object" && error !== null) {
    const apiError = error as ApiError;

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

  if (typeof error === "string") {
    return [error];
  }

  return ["An unexpected error occurred"];
};
