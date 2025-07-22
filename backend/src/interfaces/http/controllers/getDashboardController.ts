// src/interfaces/http/controllers/getDashboardSummaryController.ts
import { Request, Response } from "express";
import { DashboardSummaryUseCase } from "../../../application/useCases/DashboardSummaryUseCase.js";
import { MysqlStorageUsageRepository } from "../../../infraestructure/adapters/repositories/MysqlStorageUsageRepository.js";

const dashboardSummaryUseCase = new DashboardSummaryUseCase(
  new MysqlStorageUsageRepository(),
);

/** Get dashboard stats for authenticated user */
export const getDashboardController = async (req: Request, res: Response) => {
  try {
    const { id } = req.refreshTokenId;

    const result = await dashboardSummaryUseCase.execute(id);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error getting dashboard summary:", err);
    res.status(500).json({ message: "Failed to get dashboard summary" });
  }
};
