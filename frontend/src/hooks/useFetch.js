import { useState, useCallback } from "react";

/**
 * custom fetch, don't have useEffect included
 * @param {string} url - url to fetch
 * @param {Object} options - fetch options
 * @returns {Object} data, isLoading, status, responseError, fetchData, cancelRequest
 */

export default function useFetch() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (url, options) => {
    setIsLoading(true);
    setStatus(null);
    setError(null);
    setData(null);

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const errorData = await response.json();
        setStatus(response.status);
        setError(errorData.message);
        throw new Error(errorData.message);
      }

      const result = await response.json();
      setStatus(response.status);
      setData(result);      
    } catch (err) {
      console.error("Error fetching data:", err.message);
      setError(err.message);
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
