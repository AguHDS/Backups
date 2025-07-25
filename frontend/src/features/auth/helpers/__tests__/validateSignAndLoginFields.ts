import { describe, it, expect } from "vitest";
import { validateLoginFields } from "../validateSignAndLoginFields";

describe("validateLoginFields", () => {
  it("returns error if user and password are empty", () => {
    const result = validateLoginFields("", "");
    expect(result).toContain("All fields are required");
  });

  it("returns error if only user is present", () => {
    const result = validateLoginFields("john", "");
    expect(result).toContain("All fields are required");
  });

  it("returns error if only password is present", () => {
    const result = validateLoginFields("", "123456");
    expect(result).toContain("All fields are required");
  });

  it("does not return error if user and password are present (login)", () => {
    const result = validateLoginFields("john", "123456");
    expect(result).toEqual([]);
  });

  it("returns error if email is invalid (registration)", () => {
    const result = validateLoginFields("john", "123456", "bad-email");
    expect(result).toContain("Invalid email");
  });

  it("does not return error if email is valid (registration)", () => {
    const result = validateLoginFields("john", "123456", "john@example.com");
    expect(result).toEqual([]);
  });

  it("ignores empty email when validating login", () => {
    const result = validateLoginFields("john", "123456", "");
    expect(result).toEqual([]);
  });
});
