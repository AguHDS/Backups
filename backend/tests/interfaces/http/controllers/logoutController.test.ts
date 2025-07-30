import { logoutController } from "@/interfaces/http/controllers/logoutController.js";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Request, Response } from "express";
import { RefreshTokenUseCase } from "@/application/useCases/RefreshTokenUseCase.js";

interface MockRequestWithUserId extends Partial<Request> {
  userId: { id: number };
}

describe("logoutController", () => {
  let req: MockRequestWithUserId;
  let res: Partial<Response>;
  const logoutMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(RefreshTokenUseCase.prototype, "logout").mockImplementation(
      logoutMock
    );

    req = {
      userId: { id: 123 },
    };

    res = {
      clearCookie: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
  });

  it("should clear cookie, call logout, and return 200", async () => {
    await logoutController(req as Request, res as Response);

    expect(res.clearCookie).toHaveBeenCalledWith("refreshToken", {
      httpOnly: true,
    });
    expect(logoutMock).toHaveBeenCalledWith(123);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Logout successful" });
  });

  it("should return 500 if logout throws", async () => {
    logoutMock.mockRejectedValueOnce(new Error("DB error"));

    await logoutController(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Logout failed" });
  });
});
