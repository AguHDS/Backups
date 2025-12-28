// Time configurations (milliseconds)
export const QUERY_STALE_TIME = {
  DEFAULT: 5 * 60 * 1000,
  SHORT: 1 * 60 * 1000,
  LONG: 30 * 60 * 1000,
  STATIC: 60 * 60 * 1000,
} as const;

// Garbage collection times (milliseconds)
export const QUERY_GC_TIME = {
  DEFAULT: 10 * 60 * 1000,
  SHORT: 5 * 60 * 1000,
  LONG: 30 * 60 * 1000,
} as const;

// Retry configurations
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  shouldRetry: (failureCount: number, error: unknown) => {
    if (failureCount >= RETRY_CONFIG.MAX_RETRIES) {
      return false;
    }

    if (error && typeof error === "object" && "response" in error) {
      const status = (error as { response?: { status?: number } }).response
        ?.status;
      if (status && status >= 400 && status < 500) {
        return false;
      }
    }

    return true;
  },
} as const;

// Base query options
export const baseQueryOptions = {
  gcTime: QUERY_GC_TIME.DEFAULT,
  retry: RETRY_CONFIG.shouldRetry,
  refetchOnReconnect: true,
  refetchOnMount: true,
  refetchOnWindowFocus: false,
} as const;

export const baseMutationOptions = {
  retry: false,
} as const;

// Environment-based defaults
export const getQueryDefaults = (env: string) => {
  const isDev = env === "development";

  return {
    queries: {
      ...baseQueryOptions,
      staleTime: isDev ? QUERY_STALE_TIME.SHORT : QUERY_STALE_TIME.DEFAULT,
    },
    mutations: baseMutationOptions,
  };
};

export type QueryDefaults = ReturnType<typeof getQueryDefaults>;
