import { describe, it, expect } from "vitest";
import { UserFile } from "@/domain/entities/UserFile.js";

describe("UserFile", () => {
  it("should create a valid UserFile", () => {
    const file = new UserFile("123", "url.com", "section-1", 1000, 1);

    expect(file.publicId).toBe("123");
    expect(file.url).toBe("url.com");
    expect(file.sectionId).toBe("section-1");
    expect(file.sizeInBytes).toBe(1000);
    expect(file.userId).toBe(1);
  });

  it("should throw if any required field is missing or null", () => {
    expect(() => new UserFile("", "url", "section", 1000, 1)).toThrow("Invalid file data");
    expect(() => new UserFile("id", "", "section", 1000, 1)).toThrow("Invalid file data");
    expect(() => new UserFile("id", "url", "", 1000, 1)).toThrow("Invalid file data");
    expect(() => new UserFile("id", "url", "section", null as any, 1)).toThrow("Invalid file data");
    expect(() => new UserFile("id", "url", "section", 1000, null as any)).toThrow("Invalid file data");
  });
});
