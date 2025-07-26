import { describe, it, expect } from "vitest";
import { formatBytes } from "../formatBytes";

describe("formatBytes", () => {
  it("returns '0 Bytes' for 0", () => {
    expect(formatBytes(0)).toBe("0 Bytes");
  });

  it("formats bytes to KB", () => {
    expect(formatBytes(1024)).toBe("1 KB");
    expect(formatBytes(1536)).toBe("1.5 KB");
  });

  it("formats bytes to MB", () => {
    expect(formatBytes(1048576)).toBe("1 MB");
    expect(formatBytes(1572864)).toBe("1.5 MB");
  });

  it("formats bytes to GB", () => {
    expect(formatBytes(1073741824)).toBe("1 GB");
  });

  it("formats bytes to TB", () => {
    expect(formatBytes(1099511627776)).toBe("1 TB");
  });

  it("respects custom decimal precision", () => {
    expect(formatBytes(1536, 0)).toBe("2 KB");
    expect(formatBytes(1536, 1)).toBe("1.5 KB");
  });

  it("handles negative decimals by defaulting to 0", () => {
    expect(formatBytes(1536, -5)).toBe("2 KB");
  });
});
