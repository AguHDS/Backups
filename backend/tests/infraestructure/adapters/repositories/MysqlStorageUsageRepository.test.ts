import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";
import { RowDataPacket } from "mysql2/promise";
import { MysqlStorageUsageRepository } from "@/infraestructure/adapters/repositories/MysqlStorageUsageRepository.js";
import promisePool from "@/db/database.js";

vi.mock("@/db/database", () => ({
  default: {
    execute: vi.fn(),
  },
}));
const mockExecute = promisePool.execute as Mock;

describe("MysqlStorageUsageRepository", () => {
  const repository = new MysqlStorageUsageRepository();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("addToUsedStorage should insert or update total_bytes", async () => {
    mockExecute.mockResolvedValueOnce([{}, undefined]);

    await repository.addToUsedStorage(1, 5000);

    expect(mockExecute).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO user_storage_usage"),
      [1, 5000]
    );
  });

  it("decreaseFromUsedStorage should subtract bytes safely", async () => {
    mockExecute.mockResolvedValueOnce([{}, undefined]);

    await repository.decreaseFromUsedStorage(1, 3000);

    expect(mockExecute).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE user_storage_usage"),
      [3000, 1]
    );
  });

  it("getUsedStorage should return correct byte count", async () => {
    const rows = [{ total_bytes: 20480 }] as unknown as RowDataPacket[];
    mockExecute.mockResolvedValueOnce([rows, undefined]);

    const result = await repository.getUsedStorage(1);

    expect(result).toBe(20480);
    expect(mockExecute).toHaveBeenCalledWith(
      "SELECT total_bytes FROM user_storage_usage WHERE user_id = ?",
      [1]
    );
  });

  it("getUsedStorage should return 0 if no entry found", async () => {
    mockExecute.mockResolvedValueOnce([[] as RowDataPacket[], undefined]);

    const result = await repository.getUsedStorage(2);

    expect(result).toBe(0);
  });
});
