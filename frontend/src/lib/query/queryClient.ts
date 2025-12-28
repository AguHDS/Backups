import { QueryClient } from "@tanstack/react-query";
import { getQueryDefaults } from "./defaults";

const queryEnv = import.meta.env.VITE_QUERY_ENV;

export const queryClient = new QueryClient({
  defaultOptions: getQueryDefaults(queryEnv),
});

export { QueryClient };
