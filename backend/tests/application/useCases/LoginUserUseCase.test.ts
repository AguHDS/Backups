import { describe, it, expect, vi, beforeEach } from "vitest";
import { LoginUserUseCase } from "@/application/useCases/LoginUserUseCase.js";
import { UserRepository } from "@/domain/ports/repositories/UserRepository.js";
import { RefreshTokenRepository } from "@/domain/ports/repositories/RefreshTokenRepository.js";
import { User } from "@/domain/entities/User.js";
import * as tokenHelper from "@/infraestructure/auth/handleJwt.js";

vi.mock("bcrypt", async () => {
  return {
    default: {
      hash: vi.fn().mockResolvedValue("hashed.refresh.token"),
    },
  };
});

import bcrypt from "bcrypt";

describe("LoginUserUseCase", () => {
  const mockUser = {
    id: 1,
    name: "Test User",
    email: "test@example.com",
    role: "user" as const,
    isPasswordValid: vi.fn(),
  } as unknown as User;

  let userRepo: UserRepository;
  let refreshRepo: RefreshTokenRepository;
  let comparePasswords: (pass: string, hash: string) => Promise<boolean>;

  beforeEach(() => {
    userRepo = {
      findByUsername: vi.fn().mockResolvedValue(mockUser),
    } as unknown as UserRepository;

    refreshRepo = {
      saveRefreshToDB: vi.fn().mockResolvedValue(undefined),
    } as unknown as RefreshTokenRepository;

    comparePasswords = vi.fn().mockResolvedValue(true);

    vi.spyOn(tokenHelper, "tokenSign")
      .mockResolvedValueOnce("access.token")
      .mockResolvedValueOnce("refresh.token");
  });

  it("should return tokens and userData when credentials are correct", async () => {
    mockUser.isPasswordValid = vi.fn().mockResolvedValue(true);

    const useCase = new LoginUserUseCase(userRepo, comparePasswords, refreshRepo);
    const result = await useCase.execute("testuser", "securepassword");

    expect(userRepo.findByUsername).toHaveBeenCalledWith("testuser");
    expect(mockUser.isPasswordValid).toHaveBeenCalledWith("securepassword", comparePasswords);
    expect(tokenHelper.tokenSign).toHaveBeenCalledTimes(2);
    expect(bcrypt.hash).toHaveBeenCalledWith("refresh.token", 10);
    expect(refreshRepo.saveRefreshToDB).toHaveBeenCalledWith(
      mockUser.id,
      "hashed.refresh.token",
      expect.any(Date)
    );

    expect(result).toEqual({
      accessToken: "access.token",
      refreshToken: "refresh.token",
      userData: {
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        id: mockUser.id,
      },
    });
  });

  it("should throw error if user not found", async () => {
    (userRepo.findByUsername as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const useCase = new LoginUserUseCase(userRepo, comparePasswords, refreshRepo);

    await expect(useCase.execute("notfound", "pass")).rejects.toThrow("Credentials don't exist");
  });

  it("should throw error if password is invalid", async () => {
    mockUser.isPasswordValid = vi.fn().mockResolvedValue(false);
    const useCase = new LoginUserUseCase(userRepo, comparePasswords, refreshRepo);

    await expect(useCase.execute("testuser", "wrongpass")).rejects.toThrow("Invalid credentials");
  });
});
