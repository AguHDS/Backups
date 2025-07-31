import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request } from "express";
import { decodeRefreshToken } from "@/shared/utils/decodeRefreshToken.js";
import { verifyToken } from "@/infraestructure/auth/handleJwt.js";
import type { DecodedRefresh } from "@/shared/utils/decodeRefreshToken.js";

vi.mock("@/infraestructure/auth/handleJwt.js", () => ({
  verifyToken: vi.fn(),
}));

describe("decodeRefreshToken", () => {
  let req: Partial<Request>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return decoded token if valid", () => {
    const mockedDecoded: DecodedRefresh = {
      id: "123",
      name: "John",
      role: "user",
      iat: 12345678,
      exp: 12349999,
    };

    req = {
      cookies: {
        refreshToken: "mocked.refresh.token",
      },
    };

    (verifyToken as ReturnType<typeof vi.fn>).mockReturnValueOnce(mockedDecoded);

    const result = decodeRefreshToken(req as Request);

    expect(verifyToken).toHaveBeenCalledWith("mocked.refresh.token", "refresh");
    expect(result).toEqual(mockedDecoded);
  });

  it("should throw NO_REFRESH_TOKEN if cookie is missing", () => {
    req = {
      cookies: {},
    };

    expect(() => decodeRefreshToken(req as Request)).toThrowError("NO_REFRESH_TOKEN");
  });

  it("should throw INVALID_REFRESH_TOKEN if token is not verified", () => {
    req = {
      cookies: {
        refreshToken: "invalid.token",
      },
    };

    (verifyToken as ReturnType<typeof vi.fn>).mockReturnValueOnce(null);

    expect(() => decodeRefreshToken(req as Request)).toThrowError("INVALID_REFRESH_TOKEN");
  });
});
