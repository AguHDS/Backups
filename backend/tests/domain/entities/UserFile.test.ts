import { describe, it, expect } from "vitest";
import { UserFile } from "@/domain/entities/UserFile.js";

describe("UserFile", () => {
  it("should create a valid UserFile", () => {
    const file = new UserFile("123", "url.com", 4, 1000, 1);

    expect(file.publicId).toBe("123");
    expect(file.url).toBe("url.com");
    expect(file.sectionId).toBe(4);
    expect(file.sizeInBytes).toBe(1000);
    expect(file.userId).toBe(1);
  });

  it("should throw if any required field is missing or null", () => {
    expect(() => new UserFile("", "url", 3, 1000, 1)).toThrow("Invalid file data");
    expect(() => new UserFile("id", "", 4, 1000, 1)).toThrow("Invalid file data");
    expect(() => new UserFile("id", "url", undefined as any, 1000, 1)).toThrow("Invalid file data");
    expect(() => new UserFile("id", "url", 7, null as any, 1)).toThrow("Invalid file data");
    expect(() => new UserFile("id", "url", 12, 1000, null as any)).toThrow("Invalid file data");
  });
});
