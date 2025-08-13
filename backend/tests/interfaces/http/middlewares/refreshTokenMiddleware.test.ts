import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { refreshTokenMiddleware } from "@/interfaces/http/middlewares/refreshTokenMiddleware.js";
import { getMockReq, getMockRes } from "vitest-mock-express";
import {
  decodeRefreshToken as realDecodeRefreshToken,
  DecodedRefresh,
} from "@/shared/utils/decodeRefreshToken.js";
import { MysqlRefreshTokenRepository } from "@/infraestructure/adapters/repositories/MysqlRefreshTokenRepository.js";

vi.mock("@/shared/utils/decodeRefreshToken.js", () => ({
  decodeRefreshToken: vi.fn(),
}));

describe("refreshTokenMiddleware", () => {
  let req: any;
  let res: any;
  let next: any;
  let clearResMocks: () => void;

  const decodeRefreshToken = vi.mocked(realDecodeRefreshToken);

  beforeEach(() => {
    req = getMockReq();
    const mocks = getMockRes();
    res = mocks.res;
    next = mocks.next;
    clearResMocks = mocks.mockClear;
    clearResMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should throw 401 if there's not refresh in cookies", async () => {
    req.cookies = {};

    await refreshTokenMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "No refresh token in cookies",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should throw 403 if token in cookie isn't present or it's invalid", async () => {
    req.cookies = { refreshToken: "token-falso" };

    const decoded: DecodedRefresh = {
      id: "user123",
      name: "Agustin",
      role: "user",
      iat: 123,
      exp: 456,
    };

    decodeRefreshToken.mockReturnValue(decoded);
    vi.spyOn(MysqlRefreshTokenRepository.prototype, "findValidToken").mockResolvedValue(false);

    await refreshTokenMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Refresh token not found, doesn't match, it's invalid or expired",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next() if refresh token is valid", async () => {
    req.cookies = { refreshToken: "token-valido" };

    const decoded: DecodedRefresh = {
      id: "user123",
      name: "Agustin",
      role: "user",
      iat: 123,
      exp: 456,
    };

    decodeRefreshToken.mockReturnValue(decoded);
    vi.spyOn(MysqlRefreshTokenRepository.prototype, "findValidToken").mockResolvedValue(true);

    await refreshTokenMiddleware(req, res, next);

    expect(decodeRefreshToken).toHaveBeenCalledWith(req);
    expect(MysqlRefreshTokenRepository.prototype.findValidToken).toHaveBeenCalledWith(
      "token-valido",
      "user123"
    );
    expect(req.refreshTokenId).toEqual({ id: "user123" });
    expect(next).toHaveBeenCalled();
  });

  it("should throw 500 if there's a unexpected error", async () => {
    req.cookies = { refreshToken: "token-x" };

    decodeRefreshToken.mockImplementation(() => {
      throw new Error("Exploto todo");
    });

    await refreshTokenMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal server error",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
