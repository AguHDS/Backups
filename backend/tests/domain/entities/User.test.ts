import { describe, it, expect } from "vitest";
import { User } from "@/domain/entities/User.js";

describe("User entity", () => {
  it("should validate password using provided compareFn", async () => {
    const user = new User(1, "john", "john@example.com", "hashedpass", "user");

    const mockCompareFn = async (input: string, hash: string) => {
      return input === "correctPassword" && hash === "hashedpass";
    };

    expect(await user.isPasswordValid("correctPassword", mockCompareFn)).toBe(true);
    expect(await user.isPasswordValid("wrongPassword", mockCompareFn)).toBe(false);
  });
});
