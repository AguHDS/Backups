import { Request, Response } from "express";
import { DashboardSummaryUseCase } from "@/application/useCases/DashboardSummaryUseCase.js";
import { MysqlStorageUsageRepository } from "@/infraestructure/adapters/repositories/MysqlStorageUsageRepository.js";

const dashboardSummaryUseCase = new DashboardSummaryUseCase(
  new MysqlStorageUsageRepository()
);

/** Dashboard summary for authenticated user */
export const getDashboardController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { id } = req.user;

    const result = await dashboardSummaryUseCase.execute(id);

    res.status(200).json({
      used: Number(result.used),
      totalFiles: result.totalFiles,
      maxStorage: Number(result.maxStorage),
    });
  } catch (err) {
    console.error("Error getting dashboard summary:", err);
    res.status(500).json({ message: "Failed to get dashboard summary" });
  }
};
