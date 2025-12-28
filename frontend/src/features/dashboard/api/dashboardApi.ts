import { axiosClient } from "@/lib/http";

export interface DashboardSummaryResponse {
  used: number;
}

export const getDashboardSummary = async (): Promise<DashboardSummaryResponse> => {
  const response = await axiosClient.get<DashboardSummaryResponse>(
    "/api/dashboard-summary",
    {
      withCredentials: true,
    }
  );

  return response.data;
};
