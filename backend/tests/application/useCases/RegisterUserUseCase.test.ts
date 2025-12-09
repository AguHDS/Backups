import { describe, it, expect, vi, beforeEach, type Mocked } from "vitest";
import { RegisterUserUseCase } from "@/application/useCases/RegisterUserUseCase.js";
import type { UserRepository } from "@/domain/ports/repositories/UserRepository.js";
import type { StorageUsageRepository } from "@/domain/ports/repositories/StorageUsageRepository.js";

describe("RegisterUserUseCase", () => {
  let userRepo: Mocked<UserRepository>;
  let storageRepo: Mocked<StorageUsageRepository>;
  let encrypt: ReturnType<typeof vi.fn>;
  let useCase: RegisterUserUseCase;

  const username = "subject1";
  const email = "subject1@example.com";
  const plain = "secret";
  const hashed = "hashed-secret";
  const mockUserId = 123;

  beforeEach(() => {
    userRepo = {
      findById: vi.fn(),
      findByUsername: vi.fn(),
      isNameOrEmailTaken: vi.fn(),
      insertNewUser: vi.fn().mockResolvedValue(mockUserId), // Devuelve un ID
    } as unknown as Mocked<UserRepository>;

    storageRepo = {
      addToUsedStorage: vi.fn().mockResolvedValue(undefined),
      setMaxStorage: vi.fn().mockResolvedValue(undefined),
      decreaseFromUsedStorage: vi.fn(),
      getUsedStorage: vi.fn(),
      getMaxStorage: vi.fn(),
      getRemainingStorage: vi.fn(),
      tryReserveStorage: vi.fn(),
    } as unknown as Mocked<StorageUsageRepository>;

    encrypt = vi.fn();

    useCase = new RegisterUserUseCase(userRepo, storageRepo, encrypt);
  });

  it("should register an user when username and email are not taken", async () => {
    encrypt.mockResolvedValue(hashed);
    userRepo.isNameOrEmailTaken.mockResolvedValue({
      isTaken: false,
      userTaken: null,
      emailTaken: null,
    });

    await useCase.execute(username, email, plain);

    expect(encrypt).toHaveBeenCalledWith(plain);
    expect(userRepo.isNameOrEmailTaken).toHaveBeenCalledWith(username, email);
    expect(userRepo.insertNewUser).toHaveBeenCalledWith(
      username,
      email,
      hashed,
      "user"
    );
    expect(storageRepo.addToUsedStorage).toHaveBeenCalledWith(mockUserId, 0);
    expect(storageRepo.setMaxStorage).toHaveBeenCalledWith(
      mockUserId,
      104857600
    ); // 100MB
  });

  it("should throw and does not insert when only the username is taken", async () => {
    encrypt.mockResolvedValue(hashed);
    userRepo.isNameOrEmailTaken.mockResolvedValue({
      isTaken: true,
      userTaken: username,
      emailTaken: null,
    });

    await expect(useCase.execute(username, email, plain)).rejects.toThrow(
      "USERNAME_TAKEN"
    );

    expect(encrypt).toHaveBeenCalledWith(plain);
    expect(userRepo.insertNewUser).not.toHaveBeenCalled();
    expect(storageRepo.addToUsedStorage).not.toHaveBeenCalled();
    expect(storageRepo.setMaxStorage).not.toHaveBeenCalled();
  });

  it("should throw and does not insert when only the email is taken", async () => {
    encrypt.mockResolvedValue(hashed);
    userRepo.isNameOrEmailTaken.mockResolvedValue({
      isTaken: true,
      userTaken: null,
      emailTaken: email,
    });

    await expect(useCase.execute(username, email, plain)).rejects.toThrow(
      "EMAIL_TAKEN"
    );

    expect(encrypt).toHaveBeenCalledWith(plain);
    expect(userRepo.insertNewUser).not.toHaveBeenCalled();
    expect(storageRepo.addToUsedStorage).not.toHaveBeenCalled();
    expect(storageRepo.setMaxStorage).not.toHaveBeenCalled();
  });

  it("should throw when both are taken", async () => {
    encrypt.mockResolvedValue(hashed);
    userRepo.isNameOrEmailTaken.mockResolvedValue({
      isTaken: true,
      userTaken: username,
      emailTaken: email,
    });

    await expect(useCase.execute(username, email, plain)).rejects.toThrow(
      "USERNAME_AND_EMAIL_TAKEN"
    );

    expect(encrypt).toHaveBeenCalledWith(plain);
    expect(userRepo.insertNewUser).not.toHaveBeenCalled();
    expect(storageRepo.addToUsedStorage).not.toHaveBeenCalled();
    expect(storageRepo.setMaxStorage).not.toHaveBeenCalled();
  });

  it("should propagate repository errors in insertNewUser", async () => {
    encrypt.mockResolvedValue(hashed);
    userRepo.isNameOrEmailTaken.mockResolvedValue({
      isTaken: false,
      userTaken: null,
      emailTaken: null,
    });
    userRepo.insertNewUser.mockRejectedValue(new Error("DB_ERROR"));

    await expect(useCase.execute(username, email, plain)).rejects.toThrow(
      "DB_ERROR"
    );
    expect(encrypt).toHaveBeenCalledWith(plain);
    expect(userRepo.insertNewUser).toHaveBeenCalledWith(
      username,
      email,
      hashed,
      "user"
    );
    expect(storageRepo.addToUsedStorage).not.toHaveBeenCalled();
    expect(storageRepo.setMaxStorage).not.toHaveBeenCalled();
  });

  it("should propagate storage repository errors", async () => {
    encrypt.mockResolvedValue(hashed);
    userRepo.isNameOrEmailTaken.mockResolvedValue({
      isTaken: false,
      userTaken: null,
      emailTaken: null,
    });
    storageRepo.addToUsedStorage.mockRejectedValue(new Error("STORAGE_ERROR"));

    await expect(useCase.execute(username, email, plain)).rejects.toThrow(
      "STORAGE_ERROR"
    );
    expect(encrypt).toHaveBeenCalledWith(plain);
    expect(userRepo.insertNewUser).toHaveBeenCalledWith(
      username,
      email,
      hashed,
      "user"
    );
    expect(storageRepo.addToUsedStorage).toHaveBeenCalledWith(mockUserId, 0);
    expect(storageRepo.setMaxStorage).not.toHaveBeenCalled();
  });
});
