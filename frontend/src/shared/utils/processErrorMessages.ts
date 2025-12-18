type ValidationError = { msg: string };
type ApiError = { message: string };
type FetchError = Error | ValidationError[] | ApiError | unknown;

/**
 * Processes API error messages.
 * Can be used along with ValidationMessages component
 */
export const processErrorMessages = (error: FetchError): string[] => {
  if (Array.isArray(error)) {
    return error.map((err: { msg: string }) => err.msg);
  }

  if (typeof error === "object" && error !== null) {
    if ("errors" in error && Array.isArray(error.errors)) {
      return error.errors;
    }
    if ("message" in error) {
      return [String(error.message)];
    }
    if ("error" in error) {
      return [String(error.error)];
    }
  }

  if (typeof error === "string") {
    return [error];
  }

  return ["An unexpected error occurred"];
};
