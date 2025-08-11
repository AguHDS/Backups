import { describe, it, expect, beforeEach, vi, Mocked } from "vitest";
import { StorageManagerUseCase } from "@/application/useCases/StorageManagerUseCase.js";
import { MysqlStorageUsageRepository } from "@/infraestructure/adapters/repositories/MysqlStorageUsageRepository.js";

describe("StorageManagerUseCase", () => {
  let storageUsageRepoMock: Mocked<MysqlStorageUsageRepository>;
  let useCase: StorageManagerUseCase;

  beforeEach(() => {
    storageUsageRepoMock = {
      addToUsedStorage: vi.fn(),
      decreaseFromUsedStorage: vi.fn(),
      getUsedStorage: vi.fn(),
    } as unknown as Mocked<MysqlStorageUsageRepository>;

    useCase = new StorageManagerUseCase(storageUsageRepoMock);
  });

  it("should return totalBytesUsed when the repository returns a number", async () => {
    storageUsageRepoMock.getUsedStorage.mockResolvedValue(1500);

    const result = await useCase.execute(1);

    expect(result).toEqual({ totalBytesUsed: 1500 });
    expect(storageUsageRepoMock.getUsedStorage).toHaveBeenCalledTimes(1);
    expect(storageUsageRepoMock.getUsedStorage).toHaveBeenCalledWith(1);
  });

  it("should return 0 when the repository returns 0", async () => {
    storageUsageRepoMock.getUsedStorage.mockResolvedValue(0);

    const result = await useCase.execute("user-abc");

    expect(result).toEqual({ totalBytesUsed: 0 });
    expect(storageUsageRepoMock.getUsedStorage).toHaveBeenCalledWith(
      "user-abc"
    );
  });

  it("should propagate errors if the repository throws", async () => {
    storageUsageRepoMock.getUsedStorage.mockRejectedValue(
      new Error("DB error")
    );

    await expect(useCase.execute(123)).rejects.toThrow("DB error");
    expect(storageUsageRepoMock.getUsedStorage).toHaveBeenCalledWith(123);
  });
});
