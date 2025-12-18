import { describe, it, expect } from "vitest";
import { processErrorMessages } from "../processErrorMessages";

describe("processErrorMessages", () => {
  it("should return messages from an array of validation errors", () => {
    const error = [{ msg: "Email is required" }, { msg: "Password too short" }];
    const result = processErrorMessages(error);
    expect(result).toEqual(["Email is required", "Password too short"]);
  });

  it("should return message from an object with 'message' field", () => {
    const error = { message: "Something went wrong" };
    const result = processErrorMessages(error);
    expect(result).toEqual(["Something went wrong"]);
  });

  it("should return messages from an object with 'errors' array", () => {
    const error = { errors: ["Invalid input", "Missing fields"] };
    const result = processErrorMessages(error);
    expect(result).toEqual(["Invalid input", "Missing fields"]);
  });

  it("should return error from object with 'error' field", () => {
    const error = { error: "Internal server error" };
    const result = processErrorMessages(error);
    expect(result).toEqual(["Internal server error"]);
  });

  it("should return string error as array", () => {
    const result = processErrorMessages("Unauthorized");
    expect(result).toEqual(["Unauthorized"]);
  });

  it("should return fallback message for unknown error types", () => {
    const result = processErrorMessages(42);
    expect(result).toEqual(["An unexpected error occurred"]);
  });
});
