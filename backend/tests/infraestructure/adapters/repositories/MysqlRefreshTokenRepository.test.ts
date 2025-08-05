import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";
import bcrypt from "bcrypt";
import { Connection, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { MysqlRefreshTokenRepository } from "@/infraestructure/adapters/repositories/MysqlRefreshTokenRepository.js";
import promisePool from "@/db/database.js";

vi.mock("bcrypt", () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn(),
  },
}));

vi.mock("@/db/database", () => ({
  default: {
    execute: vi.fn(),
  },
}));

const mockConnection: Connection = {
  execute: vi.fn(),
} as unknown as Connection;

describe("MysqlRefreshTokenRepository", () => {
  const repository = new MysqlRefreshTokenRepository();

  const mockPromiseExecute = promisePool.execute as Mock;
  const mockConnectionExecute = mockConnection.execute as Mock;
  const mockCompare = bcrypt.compare as Mock;
  const mockHash = bcrypt.hash as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("saveRefreshToDB should update existing token", async () => {
    mockPromiseExecute.mockResolvedValueOnce([
      [{ user_id: 1 }] as RowDataPacket[],
      undefined,
    ]);
    mockPromiseExecute.mockResolvedValueOnce([
      {} as ResultSetHeader,
      undefined,
    ]);

    await repository.saveRefreshToDB(1, "newToken", new Date());

    expect(mockPromiseExecute).toHaveBeenCalledTimes(2);
    expect(mockPromiseExecute).toHaveBeenCalledWith(
      "UPDATE refresh_tokens SET token = ?, expires_at = ? WHERE user_id = ?",
      expect.any(Array)
    );
  });

  it("saveRefreshToDB should insert token if not existing", async () => {
    mockPromiseExecute.mockResolvedValueOnce([
      [] as RowDataPacket[],
      undefined,
    ]);
    mockPromiseExecute.mockResolvedValueOnce([
      {} as ResultSetHeader,
      undefined,
    ]);

    await repository.saveRefreshToDB(1, "newToken", new Date());

    expect(mockPromiseExecute).toHaveBeenCalledWith(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
      expect.any(Array)
    );
  });

  it("findValidToken returns true if token matches", async () => {
    const hashedToken = await bcrypt.hash("token123", 1);
    mockPromiseExecute.mockResolvedValueOnce([
      [{ token: hashedToken, expires_at: new Date() }] as RowDataPacket[],
      undefined,
    ]);
    mockCompare.mockResolvedValueOnce(true);

    const result = await repository.findValidToken("token123", "1");

    expect(result).toBe(true);
    expect(mockCompare).toHaveBeenCalledWith("token123", hashedToken);
  });

  it("findValidToken returns false if no valid token found", async () => {
    mockPromiseExecute.mockResolvedValueOnce([
      [] as RowDataPacket[],
      undefined,
    ]);

    const result = await repository.findValidToken("invalidToken", "1");

    expect(result).toBe(false);
  });

  it("getExpirationTime returns date if exists", async () => {
    const date = new Date();
    mockConnectionExecute.mockResolvedValueOnce([
      [{ expires_at: date }] as RowDataPacket[],
      undefined,
    ]);

    const result = await repository.getExpirationTime(1, mockConnection);

    expect(result).toEqual(date);
  });

  it("getExpirationTime returns null if there isn't a row", async () => {
    mockConnectionExecute.mockResolvedValueOnce([
      [] as RowDataPacket[],
      undefined,
    ]);

    const result = await repository.getExpirationTime(1, mockConnection);

    expect(result).toBeNull();
  });

  it("updateRefreshTokenWithRotation should hash and update", async () => {
    mockHash.mockResolvedValue("hashedToken");

    await repository.updateRefreshTokenWithRotation(
      "token123",
      1,
      mockConnection
    );

    expect(mockConnectionExecute).toHaveBeenCalledWith(
      "UPDATE refresh_tokens SET token = ?, last_rotated_at = CURRENT_TIMESTAMP WHERE user_id = ?",
      ["hashedToken", 1]
    );
  });

  it("deleteRefreshFromDB should call DELETE with correct userId", async () => {
    mockPromiseExecute.mockResolvedValueOnce([
      { affectedRows: 1 } as ResultSetHeader,
      undefined,
    ]);

    await repository.deleteRefreshFromDB(1);

    expect(mockPromiseExecute).toHaveBeenCalledWith(
      "DELETE FROM refresh_tokens WHERE user_id = ?",
      [1]
    );
  });

  it("searchRefreshToken returns true if token found", async () => {
    mockPromiseExecute.mockResolvedValueOnce([
      [{ user_id: 1 }] as RowDataPacket[],
      undefined,
    ]);

    const result = await repository.searchRefreshToken(1);

    expect(result).toBe(true);
  });

  it("searchRefreshToken returns false if not found", async () => {
    mockPromiseExecute.mockResolvedValueOnce([
      [] as RowDataPacket[],
      undefined,
    ]);

    const result = await repository.searchRefreshToken(1);

    expect(result).toBe(false);
  });
});
