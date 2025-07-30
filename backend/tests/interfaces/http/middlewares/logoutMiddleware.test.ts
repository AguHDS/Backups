import { logoutMiddleware } from "@/interfaces/http/middlewares/logoutMiddleware.js";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { RefreshTokenUseCase } from "@/application/useCases/RefreshTokenUseCase.js";
import { Request, Response, NextFunction } from "express";

describe("logoutMiddleware", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    mockReq = {
      body: {},
      cookies: {},
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    next = vi.fn();
  });

  it("should return 401 if id is missing", async () => {
    await logoutMiddleware(mockReq as Request, mockRes as Response, next);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "No user id for logout request",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if user has no refresh token in DB", async () => {
    mockReq.body = { id: 42 };
    vi.spyOn(RefreshTokenUseCase.prototype, "hasRefreshInDB").mockResolvedValue(
      false
    );

    await logoutMiddleware(mockReq as Request, mockRes as Response, next);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "User has no refresh token in the db",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if refreshToken cookie is missing", async () => {
    mockReq.body = { id: 42 };
    mockReq.cookies = {};
    vi.spyOn(RefreshTokenUseCase.prototype, "hasRefreshInDB").mockResolvedValue(
      true
    );

    await logoutMiddleware(mockReq as Request, mockRes as Response, next);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "User has no refresh token in cookies",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next() and attach userId if everything is valid", async () => {
    mockReq.body = { id: 42 };
    mockReq.cookies = { refreshToken: "some-token" };
    vi.spyOn(RefreshTokenUseCase.prototype, "hasRefreshInDB").mockResolvedValue(
      true
    );

    await logoutMiddleware(mockReq as Request, mockRes as Response, next);

    expect(mockReq.userId).toEqual({ id: 42 });
    expect(next).toHaveBeenCalled();
  });
});
