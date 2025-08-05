import { describe, it, expect, vi } from "vitest";
import { DashboardSummaryUseCase } from "@/application/useCases/DashboardSummaryUseCase.js";
import type { StorageUsageRepository } from "@/domain/ports/repositories/StorageUsageRepository.js";

describe("DashboardSummaryUseCase", () => {
  it("should return used storage from repository", async () => {
    const mockStorageRepo: StorageUsageRepository = {
      getUsedStorage: vi.fn().mockResolvedValue(12345),
      addToUsedStorage: vi.fn(),
      decreaseFromUsedStorage: vi.fn()
    };

    const useCase = new DashboardSummaryUseCase(mockStorageRepo);

    const result = await useCase.execute(1);

    expect(result).toEqual({ used: 12345 });
    expect(mockStorageRepo.getUsedStorage).toHaveBeenCalledWith(1);
  });
});
