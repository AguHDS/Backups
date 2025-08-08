import { describe, it, expect, vi, beforeEach } from "vitest";
import { GetStorageUsageUseCase } from "@/application/useCases/GetStorageUsageUseCase.js";
import type { UserRepository } from "@/domain/ports/repositories/UserRepository.js";
import type { StorageUsageRepository } from "@/domain/ports/repositories/StorageUsageRepository.js";
import { User } from "@/domain/entities/User.js";

describe("GetStorageUsageUseCase", () => {
  const mockUserRepo: UserRepository = {
    findByUsername: vi.fn(),
    findById: vi.fn(),
    isNameOrEmailTaken: vi.fn(),
    insertNewUser: vi.fn()
  };

  const mockStorageRepo: StorageUsageRepository = {
    getUsedStorage: vi.fn(),
    addToUsedStorage: vi.fn(),
    decreaseFromUsedStorage: vi.fn()
  };

  const useCase = new GetStorageUsageUseCase(mockUserRepo, mockStorageRepo);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return used storage for a valid username", async () => {
    const username = "subject";
    const mockUser = new User(1, username, "subject@example.com", "hashedpass", "user");

    (mockUserRepo.findByUsername as any).mockResolvedValue(mockUser);
    (mockStorageRepo.getUsedStorage as any).mockResolvedValue(123456);

    const result = await useCase.execute(username);

    expect(result).toEqual({ used: 123456 });
    expect(mockUserRepo.findByUsername).toHaveBeenCalledWith(username);
    expect(mockStorageRepo.getUsedStorage).toHaveBeenCalledWith(mockUser.id);
  });

  it("should throw USER_NOT_FOUND if user does not exist", async () => {
    (mockUserRepo.findByUsername as any).mockResolvedValue(null);

    await expect(useCase.execute("ghost")).rejects.toThrow("USER_NOT_FOUND");
    expect(mockUserRepo.findByUsername).toHaveBeenCalledWith("ghost");
    expect(mockStorageRepo.getUsedStorage).not.toHaveBeenCalled();
  });
});
