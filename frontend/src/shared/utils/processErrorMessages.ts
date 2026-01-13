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
    status?: number;
  };
  message?: string;
};

type FetchError = Error | ValidationError[] | ApiError | AxiosErrorResponse | unknown;

/**
 * Processes API error messages
 * Can be used along with ValidationMessages component
 */
export const processErrorMessages = (error: FetchError): string[] => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const axiosError = error as AxiosErrorResponse;
    if (axiosError.response?.data) {
      const apiError = axiosError.response.data;

      if (apiError.error) {
        if (apiError.error.includes("You only can upload image files")) {
          return ["You only can upload image files"];
        }
        return [String(apiError.error)];
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

      if (apiError.code === "INVALID_FILE_TYPE") {
        return ["You only can upload image files"];
      }

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

        if (apiError.message.includes("You only can upload image files")) {
          return ["You only can upload image files"];
        }

        if (
          apiError.message.toLowerCase().includes("password") ||
          apiError.message.toLowerCase().includes("too short") ||
          apiError.message.toLowerCase().includes("too weak") ||
          apiError.message.toLowerCase().includes("invalid")
        ) {
          return [apiError.message];
        }

        // Return message directly (BetterAuth and backend already send proper messages)
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
      // Handle invalid file type error
      if (apiError.error.includes("You only can upload image files")) {
        return ["You only can upload image files"];
      }
      return [String(apiError.error)];
    }

    if (apiError.errors && Array.isArray(apiError.errors)) {
      return apiError.errors.map((err) =>
        typeof err === "string" ? err : err.msg || String(err)
      );
    }

    if (apiError.message) {
      // Handle invalid file type message
      if (apiError.message.includes("You only can upload image files")) {
        return ["You only can upload image files"];
      }

      // Handle BetterAuth password validation errors
      if (
        apiError.message.toLowerCase().includes("password") ||
        apiError.message.toLowerCase().includes("too short") ||
        apiError.message.toLowerCase().includes("too weak") ||
        apiError.message.toLowerCase().includes("invalid")
      ) {
        return [apiError.message];
      }

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

    // Handle file type errors
    if (errorMessage.includes("You only can upload image files")) {
      return ["You only can upload image files"];
    }

    // Handle BetterAuth password validation errors
    if (
      errorMessage.toLowerCase().includes("password") ||
      errorMessage.toLowerCase().includes("too short") ||
      errorMessage.toLowerCase().includes("too weak") ||
      errorMessage.toLowerCase().includes("invalid")
    ) {
      return [errorMessage];
    }
    
    return [errorMessage];
  }

  if (typeof error === "string") {
    // Handle file type error strings
    if (error.includes("You only can upload image files")) {
      return ["You only can upload image files"];
    }

    // Handle BetterAuth password validation error strings
    if (
      error.toLowerCase().includes("password") ||
      error.toLowerCase().includes("too short") ||
      error.toLowerCase().includes("too weak") ||
      error.toLowerCase().includes("invalid")
    ) {
      return [error];
    }

    return [error];
  }

  return ["An unexpected error occurred"];
};