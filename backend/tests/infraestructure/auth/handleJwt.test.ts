import { describe, it, expect, vi, beforeEach } from "vitest";
import * as handleJwt from "@/infraestructure/auth/handleJwt.js";
import jwt from "jsonwebtoken";
import config from "@/infraestructure/config/environmentVars.js";
import type { JwtUserData } from "@/shared/dtos/jwtUserData.js";

const user: JwtUserData = {
  id: 123,
  name: "TestUser",
  role: "user",
};

describe("handleJwt", () => {
  let originalAccessSecret: string;
  let originalRefreshSecret: string;

  beforeEach(() => {
    originalAccessSecret = config.jwtSecret;
    originalRefreshSecret = config.jwtRefreshSecret;
    vi.clearAllMocks();
  });

  it("should sign and verify an access token correctly", async () => {
    const token = await handleJwt.tokenSign(user, "access", "1h");

    expect(typeof token).toBe("string");

    const decoded = handleJwt.verifyToken(token, "access");

    expect(decoded).toMatchObject({
      id: 123,
      name: "TestUser",
      role: "user",
    });
  });

  it("should sign and verify a refresh token correctly", async () => {
    const token = await handleJwt.tokenSign(user, "refresh", "1h");

    expect(typeof token).toBe("string");

    const decoded = handleJwt.verifyToken(token, "refresh");

    expect(decoded).toMatchObject({
      id: 123,
      name: "TestUser",
      role: "user",
    });
  });

  it("should throw if secret is missing for tokenSign", async () => {
    (config as any).jwtSecret = "";

    await expect(() => handleJwt.tokenSign(user, "access")).rejects.toThrow(
      "Token generation failed"
    );

    (config as any).jwtSecret = originalAccessSecret;
  });

  it("should return null if token is invalid", () => {
    const fakeToken = "invalid.token.string";

    const result = handleJwt.verifyToken(fakeToken, "access");

    expect(result).toBeNull();
  });

  it("should return null if secret is missing for verifyToken", () => {
    const token = jwt.sign(user, originalRefreshSecret, { expiresIn: "1h" });

    (config as any).jwtRefreshSecret = "";

    const result = handleJwt.verifyToken(token, "refresh");

    expect(result).toBeNull();

    (config as any).jwtRefreshSecret = originalRefreshSecret;
  });
});
