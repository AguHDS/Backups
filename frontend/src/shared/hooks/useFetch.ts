import { useState, useCallback } from "react";

interface FetchResponse<Data> {
  data: Data | null;
  isLoading: boolean;
  status: number | null;
  error: string | null;
  fetchData: (url: string, options?: RequestInit) => Promise<void>;
}

/**
 * Custom fetch without useEffect included
 * @returns {Object} data, isLoading, status, error, fetchData
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

      if (!response.ok) {
        const errorData = await response.json();
        setStatus(response.status);
        setError(typeof errorData === "string" ? errorData : JSON.stringify(errorData));
        return;
      }

      const result = await response.json();
      setStatus(response.status);
      setData(result);      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error (useFetch)";
      console.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    data,
    isLoading,
    status,
    error,
    fetchData,
  };
}