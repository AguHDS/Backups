import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDashboardSummary } from "../api/dashboardApi";
import type { DashboardSummaryResponse } from "../api/dashboardApi";

export const useDashboardSummary = () => {
  return useQuery<DashboardSummaryResponse, Error>({
    queryKey: ["dashboardSummary"],
    queryFn: getDashboardSummary,
    staleTime: 1000 * 60, // 1 minute
  });
};

// Hook to invalidate dashboard summary (useful after uploads/deletes)
export const useInvalidateDashboard = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
  };
};
