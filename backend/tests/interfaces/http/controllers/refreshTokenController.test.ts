import { refreshTokenController } from "@/interfaces/http/controllers/refreshTokenController.js";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Request, Response } from "express";
import { RefreshTokenUseCase } from "@/application/useCases/RefreshTokenUseCase.js";
import * as db from "@/db/database.js";

vi.mock("@/db/database.js", () => ({
  default: {
    getConnection: vi.fn(),
  },
}));

interface MockRequest extends Partial<Request> {
  refreshTokenId: { id: string };
}

describe("refreshTokenController", () => {
  let req: MockRequest;
  let res: Partial<Response>;
  let mockConnection: any;
  let executeMock: any;

  beforeEach(() => {
    vi.clearAllMocks();

    req = {
      refreshTokenId: { id: "user123" },
    };

    res = {
      cookie: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    mockConnection = {
      beginTransaction: vi.fn(),
      commit: vi.fn(),
      rollback: vi.fn(),
      release: vi.fn(),
    };

    executeMock = vi
      .spyOn(RefreshTokenUseCase.prototype, "execute")
      .mockResolvedValue({
        accessToken: "access-token",
        refreshToken: "refresh-token",
        userData: { id: 123, name: "John", role: "user" },
        timeRemaining: 3600,
        refreshTokenRotated: true,
      });

    (db.default.getConnection as any).mockResolvedValue(mockConnection);
  });

  it("should rotate refresh token and respond with 200", async () => {
    await refreshTokenController(req as Request, res as Response);

    expect(mockConnection.beginTransaction).toHaveBeenCalled();
    expect(executeMock).toHaveBeenCalledWith("user123", mockConnection);
    expect(mockConnection.commit).toHaveBeenCalled();
    expect(res.cookie).toHaveBeenCalledWith(
      "refreshToken",
      "refresh-token",
      expect.objectContaining({
        httpOnly: true,
        maxAge: 3600 * 1000,
      })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      accessToken: "access-token",
      userData: { id: 123, name: "John", role: "user" },
      refreshTokenRotated: true,
    });
    expect(mockConnection.release).toHaveBeenCalled();
  });

  it("should not set cookie if token is not rotated", async () => {
    executeMock.mockResolvedValueOnce({
      accessToken: "a",
      refreshToken: "b",
      userData: { id: 1, name: "test", role: "admin" },
      timeRemaining: 1000,
      refreshTokenRotated: false,
    });

    await refreshTokenController(req as Request, res as Response);

    expect(res.cookie).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      accessToken: "a",
      userData: { id: 1, name: "test", role: "admin" },
      refreshTokenRotated: false,
    });
  });

  it("should respond 404 if user not found", async () => {
    executeMock.mockRejectedValueOnce(new Error("USER_NOT_FOUND"));

    await refreshTokenController(req as Request, res as Response);

    expect(mockConnection.rollback).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "User not found in the database",
    });
  });

  it("should respond 403 if refresh token expired", async () => {
    executeMock.mockRejectedValueOnce(new Error("REFRESH_TOKEN_EXPIRED"));

    await refreshTokenController(req as Request, res as Response);

    expect(mockConnection.rollback).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Refresh token has expired",
    });
  });

  it("should respond 500 on unknown error", async () => {
    executeMock.mockRejectedValueOnce(new Error("UNKNOWN"));

    await refreshTokenController(req as Request, res as Response);

    expect(mockConnection.rollback).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal Server Error",
    });
  });
});
