import { describe, it, expect, vi, beforeEach } from "vitest";
import { GetStorageUsageUseCase } from "@/application/useCases/GetStorageUsageUseCase.js";
import type { UserRepository } from "@/domain/ports/repositories/UserRepository.js";
import type { StorageUsageRepository } from "@/domain/ports/repositories/StorageUsageRepository.js";
import { User } from "@/domain/entities/User.js";

describe("GetStorageUsageUseCase", () => {
  const mockUserRepo = {
    findByUsername: vi.fn(),
    findById: vi.fn(),
    isNameOrEmailTaken: vi.fn(),
    insertNewUser: vi.fn()
  } as UserRepository;

  const mockStorageRepo = {
    getUsedStorage: vi.fn(),
    addToUsedStorage: vi.fn(),
    setMaxStorage: vi.fn(),
    decreaseFromUsedStorage: vi.fn(),
    getMaxStorage: vi.fn(),
    getRemainingStorage: vi.fn(),
    tryReserveStorage: vi.fn()
  } as StorageUsageRepository;

  const useCase = new GetStorageUsageUseCase(mockUserRepo, mockStorageRepo);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return used, limit and remaining storage for a valid username", async () => {
    const username = "subject";
    const mockUser = new User(1, username, "subject@example.com", "hashedpass", "user");

    mockUserRepo.findByUsername = vi.fn().mockResolvedValue(mockUser);
    mockStorageRepo.getUsedStorage = vi.fn().mockResolvedValue(500);
    mockStorageRepo.getMaxStorage = vi.fn().mockResolvedValue(1000);

    const result = await useCase.execute(username);

    expect(result).toEqual({ used: 500, limit: 1000, remaining: 500 });
    expect(mockUserRepo.findByUsername).toHaveBeenCalledWith(username);
    expect(mockStorageRepo.getUsedStorage).toHaveBeenCalledWith(mockUser.id);
    expect(mockStorageRepo.getMaxStorage).toHaveBeenCalledWith(mockUser.id);
  });

  it("should clamp remaining to 0 if used exceeds limit", async () => {
    const username = "subject";
    const mockUser = new User(1, username, "subject@example.com", "hashedpass", "user");

    mockUserRepo.findByUsername = vi.fn().mockResolvedValue(mockUser);
    mockStorageRepo.getUsedStorage = vi.fn().mockResolvedValue(1500);
    mockStorageRepo.getMaxStorage = vi.fn().mockResolvedValue(1000);

    const result = await useCase.execute(username);

    expect(result).toEqual({ used: 1500, limit: 1000, remaining: 0 });
    expect(mockUserRepo.findByUsername).toHaveBeenCalledWith(username);
    expect(mockStorageRepo.getUsedStorage).toHaveBeenCalledWith(mockUser.id);
    expect(mockStorageRepo.getMaxStorage).toHaveBeenCalledWith(mockUser.id);
  });

  it("should throw USER_NOT_FOUND if user does not exist", async () => {
    mockUserRepo.findByUsername = vi.fn().mockResolvedValue(null);

    await expect(useCase.execute("ghost")).rejects.toThrow("USER_NOT_FOUND");
    expect(mockUserRepo.findByUsername).toHaveBeenCalledWith("ghost");
    expect(mockStorageRepo.getUsedStorage).not.toHaveBeenCalled();
    expect(mockStorageRepo.getMaxStorage).not.toHaveBeenCalled();
  });
});