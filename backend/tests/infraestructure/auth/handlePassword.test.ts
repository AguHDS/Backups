import { describe, it, expect } from "vitest";
import { encrypt, compare } from "@/infraestructure/auth/handlePassword.js";

describe("handlePassword", () => {
  it("should hash a password and return a different string", async () => {
    const plain = "mySecretPassword";
    const hashed = await encrypt(plain);

    expect(hashed).not.toBe(plain);
    expect(typeof hashed).toBe("string");
    expect(hashed.length).toBeGreaterThan(0);
  });

  it("should return true when comparing matching passwords", async () => {
    const plain = "securePassword123";
    const hashed = await encrypt(plain);

    const isMatch = await compare(plain, hashed);
    expect(isMatch).toBe(true);
  });

  it("should return false when comparing non-matching passwords", async () => {
    const hashOfOriginal = await encrypt("originalPassword");
    const isMatch = await compare("wrongPassword", hashOfOriginal);

    expect(isMatch).toBe(false);
  });
});
