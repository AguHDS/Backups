import { useState, useCallback } from "react";

interface FetchResponse<T> {
  data: T | null;
  isLoading: boolean;
  status: number | null;
  setStatus: (status: number | null) => void;
  error: string | null;
  fetchData: (url: string, options?: RequestInit) => Promise<void>;
  reset: () => void;
}

/**
 * Custom hook to perform fetch requests
 */
export const useFetch = <Data = unknown>(): FetchResponse<Data> => {
  const [data, setData] = useState<Data | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (url: string, options?: RequestInit) => {
    setIsLoading(true);
    setStatus(null);
    setError(null);
    setData(null);

    try {
      const response = await fetch(url, options);
      const statusCode = response.status;
      const result = await response.json();

      setStatus(statusCode);

      if (!response.ok) {
        let errorMessage = "Unexpected error";

        if (result?.error) {
          errorMessage = result.error;
        } else if (result?.message) {
          errorMessage = result.message;
        } else if (typeof result === "string") {
          errorMessage = result;
        } else if (result?.details?.message) {
          errorMessage = result.details.message;
        }

        setError(errorMessage);
        setData(result);
        return;
      }

      setData(result);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error (useFetch)";
      console.error("Fetch exception:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setIsLoading(true);
    setStatus(null);
    setError(null);
  }, []);

  return {
    data,
    fetchData,
    status,
    setStatus,
    isLoading,
    error,
    reset,
  };
};