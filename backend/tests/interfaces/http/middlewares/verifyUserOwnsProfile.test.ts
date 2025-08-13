import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { verifyUserOwnsProfile } from "@/interfaces/http/middlewares/verifyUserOwnsProfile.js";
import { getMockReq, getMockRes } from "vitest-mock-express";
import {
  decodeRefreshToken as realDecodeRefreshToken,
  DecodedRefresh,
} from "@/shared/utils/decodeRefreshToken.js";

vi.mock("@/shared/utils/decodeRefreshToken.js", () => ({
  decodeRefreshToken: vi.fn(),
}));

describe("verifyUserOwnsProfile", () => {
  let req: any;
  let res: any;
  let next: any;
  let clearResMocks: () => void;

  const decodeRefreshToken = vi.mocked(realDecodeRefreshToken);

  const validDecoded: DecodedRefresh = {
    id: "123",
    name: "agustin",
    role: "user",
    iat: 123456,
    exp: 123999,
  };

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

  it("should call next() when token is valid and username matches", async () => {
    req.params = { username: "agustin" };
    decodeRefreshToken.mockReturnValue(validDecoded);

    const middleware = verifyUserOwnsProfile();
    await middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should throw 403 when token is valid but username not matches", async () => {
    req.params = { username: "otro_usuario" };
    decodeRefreshToken.mockReturnValue(validDecoded);

    const middleware = verifyUserOwnsProfile();
    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "You don't have permission for this profile",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next() when token is valid but without username in params", async () => {
    decodeRefreshToken.mockReturnValue(validDecoded);
    req.params = {};

    const middleware = verifyUserOwnsProfile();
    await middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should call next() when having right data", async () => {
    decodeRefreshToken.mockReturnValue(validDecoded);
    req.params = { username: "agustin" };

    const middleware = verifyUserOwnsProfile(true);
    await middleware(req, res, next);

    expect((req as any).baseUserData).toEqual({
      name: "agustin",
      role: "user",
      id: "123",
    });
    expect(next).toHaveBeenCalled();
  });

  it("decodeRefreshToken throw no refresh error", async () => {
    decodeRefreshToken.mockImplementation(() => {
      throw new Error("NO_REFRESH_TOKEN");
    });

    const middleware = verifyUserOwnsProfile();
    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "No refresh token in cookies",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("decodeRefreshToken throw invalid refresh token", async () => {
    decodeRefreshToken.mockImplementation(() => {
      throw new Error("INVALID_REFRESH_TOKEN");
    });

    const middleware = verifyUserOwnsProfile();
    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid or expired refresh token",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should not call next() when unexpected error", async () => {
    decodeRefreshToken.mockImplementation(() => {
      throw new Error("DB crash");
    });

    const middleware = verifyUserOwnsProfile();
    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal server error",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
