import { describe, it, expect, vi, beforeEach, type Mocked } from "vitest";
import { RefreshTokenUseCase } from "@/application/useCases/RefreshTokenUseCase.js";
import type { UserRepository } from "@/domain/ports/repositories/UserRepository.js";
import { User } from "@/domain/entities/User.js"
import type { RefreshTokenRepository } from "@/domain/ports/repositories/RefreshTokenRepository.js";
import type { Connection } from "mysql2/promise";

describe("RefreshTokenUseCase", () => {
  let mockUserRepo: Mocked<UserRepository>;
  let mockRefreshRepo: Mocked<RefreshTokenRepository>;
  let mockTokenSign: ReturnType<typeof vi.fn>;
  let connection: Connection;
  let useCase: RefreshTokenUseCase;

  beforeEach(() => {
    mockUserRepo = {
      findById: vi.fn(),
      findByUsername: vi.fn(),
      isNameOrEmailTaken: vi.fn(),
      insertNewUser: vi.fn(),
    } as unknown as Mocked<UserRepository>;

    mockRefreshRepo = {
      getExpirationTime: vi.fn(),
      getLastRotatedAt: vi.fn(),
      updateRefreshTokenWithRotation: vi.fn(),
      searchRefreshToken: vi.fn(),
      deleteRefreshFromDB: vi.fn(),
      saveRefreshToDB: vi.fn(),
      findValidToken: vi.fn(),
    } as unknown as Mocked<RefreshTokenRepository>;

    mockTokenSign = vi.fn();

    connection = {} as Connection;

    useCase = new RefreshTokenUseCase(
      mockUserRepo,
      mockRefreshRepo,
      mockTokenSign
    );
  });

  it("should renew access and refresh token if there is not cooldown", async () => {
    const fakeUser = new User(1, "subject1", "subject1@example.com", "hashed", "user");
    mockUserRepo.findById.mockResolvedValue(fakeUser);

    mockTokenSign
      .mockResolvedValueOnce("newAccessToken") // access
      .mockResolvedValueOnce("newRefreshToken"); // refresh
    mockRefreshRepo.getExpirationTime.mockResolvedValue(
      new Date(Date.now() + 60_000) // 60segs remaining
    );
    mockRefreshRepo.getLastRotatedAt.mockResolvedValue(
      new Date(Date.now() - 30_000) // 30seg ago
    );

    const result = await useCase.execute(1, connection);

    expect(result.accessToken).toBe("newAccessToken");
    expect(result.refreshToken).toBe("newRefreshToken");
    expect(result.refreshTokenRotated).toBe(true);
    expect(mockRefreshRepo.updateRefreshTokenWithRotation).toHaveBeenCalledWith(
      "newRefreshToken",
      1,
      connection
    );
  });

  it("should renew only access token if there is cooldown", async () => {
    const fakeUser = new User(1, "subject1", "subject1@example.com", "hashed", "user");
    mockUserRepo.findById.mockResolvedValue(fakeUser);

    mockTokenSign.mockResolvedValue("newAccessToken");
    mockRefreshRepo.getExpirationTime.mockResolvedValue(
      new Date(Date.now() + 60_000)
    );
    mockRefreshRepo.getLastRotatedAt.mockResolvedValue(
      new Date(Date.now() - 5_000) // 5seg ago
    );

    const result = await useCase.execute(1, connection);

    expect(result.accessToken).toBe("newAccessToken");
    expect(result.refreshToken).toBe("");
    expect(result.refreshTokenRotated).toBe(false);
    expect(mockRefreshRepo.updateRefreshTokenWithRotation).not.toHaveBeenCalled();
  });

  it("should throw error if user doesn't exist", async () => {
    mockUserRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute(1, connection)).rejects.toThrow("USER_NOT_FOUND");
  });

  it("should throw error if there isn't refresh token in DB", async () => {
    const fakeUser = new User(1, "subject1", "subject1@example.com", "hashed", "user");
    mockUserRepo.findById.mockResolvedValue(fakeUser);

    mockTokenSign.mockResolvedValue("accessToken");
    mockRefreshRepo.getExpirationTime.mockResolvedValue(null);
    mockRefreshRepo.getLastRotatedAt.mockResolvedValue(null);

    await expect(useCase.execute(1, connection)).rejects.toThrow(
      "REFRESH_TOKEN_NOT_FOUND"
    );
  });

  it("should throw error if refresh token is expired", async () => {
    const fakeUser = new User(1, "subject1", "subject1@example.com", "hashed", "user");
    mockUserRepo.findById.mockResolvedValue(fakeUser);

    mockTokenSign.mockResolvedValue("accessToken");
    mockRefreshRepo.getExpirationTime.mockResolvedValue(
      new Date(Date.now() - 1000) // expired
    );
    mockRefreshRepo.getLastRotatedAt.mockResolvedValue(new Date());

    await expect(useCase.execute(1, connection)).rejects.toThrow(
      "REFRESH_TOKEN_EXPIRED"
    );
  });

  it("hasRefreshInDB should delegate in repo", async () => {
    mockRefreshRepo.searchRefreshToken.mockResolvedValue(true);
    const result = await useCase.hasRefreshInDB(1);
    expect(result).toBe(true);
    expect(mockRefreshRepo.searchRefreshToken).toHaveBeenCalledWith(1);
  });

  it("logout should delegate in repo", async () => {
    await useCase.logout(1);
    expect(mockRefreshRepo.deleteRefreshFromDB).toHaveBeenCalledWith(1);
  });
});