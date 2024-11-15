import { useState } from "react";

/**
 * custom fetch, don't have useEffect included
 * @param {string} url - url to fetch
 * @param {Object} options - fetch options
 * @returns {Object} data, isLoading, status, responseError, fetchData, cancelRequest
 */

export default function useFetch() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  const controller = new AbortController();

  const fetchData = async (url, options) => {
    setIsLoading(true);
    setStatus(null);
    setError(null);
    setData(null);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();

        setStatus(response.status);
        setError(errorData.message);

        throw new Error(errorData.message);
      }

      //you'll get the message "login successfull as ${user} as 200 response here"
      const result = await response.json();
      setStatus(response.status);
      setData(result);
      
    } catch (error) {
      console.error(error);
      console.error("Error fetching data:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading,
    status,
    error,
    fetchData,
  };
}
