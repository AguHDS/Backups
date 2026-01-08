import { axiosClient } from "@/lib/http";

export interface DashboardSummaryResponse {
  used: number;
  totalFiles: number;
  maxStorage: number;
}

export const getDashboardSummary =
  async (): Promise<DashboardSummaryResponse> => {
    const response = await axiosClient.get<DashboardSummaryResponse>(
      "/api/dashboard-summary"
    );

    return response.data;
  };
