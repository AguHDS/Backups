import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";
import { ResultSetHeader, PoolConnection } from "mysql2/promise";
import { MysqlUserRepository } from "@/infraestructure/adapters/repositories/MysqlUserRepository.js";
import { User } from "@/domain/entities/User.js";
import promisePool from "@/db/database.js";

vi.mock("@/db/database", () => ({
  default: {
    execute: vi.fn(),
    getConnection: vi.fn(),
  },
}));

const mockExecute = promisePool.execute as Mock;
const mockGetConnection = promisePool.getConnection as Mock;

const mockConnection: PoolConnection = {
  execute: vi.fn(),
  beginTransaction: vi.fn(),
  commit: vi.fn(),
  rollback: vi.fn(),
  release: vi.fn(),
} as unknown as PoolConnection;

describe("MysqlUserRepository", () => {
  const repository = new MysqlUserRepository();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("findByUsername should return User if found", async () => {
    const row = {
      id: 1,
      namedb: "subject",
      emaildb: "subject@example.com",
      passdb: "hashedpass",
      role: "user",
    };
    mockExecute.mockResolvedValueOnce([[row], undefined]);

    const result = await repository.findByUsername("subject");

    expect(result).toEqual(
      new User(1, "subject", "subject@example.com", "hashedpass", "user")
    );
    expect(mockExecute).toHaveBeenCalledWith(
      "SELECT * FROM users WHERE namedb = ?",
      ["subject"]
    );
  });

  it("findByUsername should return null if not found", async () => {
    mockExecute.mockResolvedValueOnce([[], undefined]);

    const result = await repository.findByUsername("missing");

    expect(result).toBeNull();
  });

  it("findById should return User if found", async () => {
    const row = {
      id: 1,
      namedb: "subject",
      emaildb: "subject@example.com",
      passdb: "hashedpass",
      role: "user",
    };
    (mockConnection.execute as Mock).mockResolvedValueOnce([[row], undefined]);

    const result = await repository.findById(1, mockConnection);

    expect(result).toEqual(
      new User(1, "subject", "subject@example.com", "hashedpass", "user")
    );
  });

  it("findById should return null if not found", async () => {
    (mockConnection.execute as Mock).mockResolvedValueOnce([[], undefined]);

    const result = await repository.findById(1, mockConnection);

    expect(result).toBeNull();
  });

  it("isNameOrEmailTaken should return true and which fields are taken", async () => {
    const results = [{ namedb: "subject", emaildb: "subject@example.com" }];
    mockExecute.mockResolvedValueOnce([results, undefined]);

    const result = await repository.isNameOrEmailTaken(
      "subject",
      "subject@example.com"
    );

    expect(result).toEqual({
      isTaken: true,
      userTaken: "subject",
      emailTaken: "subject@example.com",
    });
  });

  it("isNameOrEmailTaken should return false if no matches", async () => {
    mockExecute.mockResolvedValueOnce([[], undefined]);

    const result = await repository.isNameOrEmailTaken(
      "newuser",
      "new@example.com"
    );

    expect(result).toEqual({
      isTaken: false,
      userTaken: null,
      emailTaken: null,
    });
  });

  it("insertNewUser should insert user and related profile records", async () => {
    const insertId = 123;
    mockGetConnection.mockResolvedValueOnce(mockConnection);
    (mockConnection.execute as Mock).mockResolvedValueOnce([
      { insertId } as ResultSetHeader,
      undefined,
    ]);
    (mockConnection.execute as Mock).mockResolvedValue([{}, undefined]);

    await repository.insertNewUser(
      "subject",
      "subject@example.com",
      "hashedpass",
      "user"
    );

    expect(mockConnection.beginTransaction).toHaveBeenCalled();
    expect(mockConnection.execute).toHaveBeenCalledWith(
      "INSERT INTO users (namedb, emaildb, passdb, role) VALUES (?, ?, ?, ?)",
      ["subject", "subject@example.com", "hashedpass", "user"]
    );
    expect(mockConnection.execute).toHaveBeenCalledWith(
      "INSERT INTO users_profile (fk_users_id) VALUES (?)",
      [insertId]
    );
    expect(mockConnection.execute).toHaveBeenCalledWith(
      "INSERT INTO users_profile_sections (fk_users_id) VALUES (?)",
      [insertId]
    );
    expect(mockConnection.commit).toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
  });

  it("insertNewUser should rollback on error", async () => {
    mockGetConnection.mockResolvedValueOnce(mockConnection);
    (mockConnection.execute as Mock).mockRejectedValueOnce(
      new Error("DB error")
    );

    await expect(
      repository.insertNewUser(
        "subject",
        "subject@example.com",
        "hashedpass",
        "user"
      )
    ).rejects.toThrow("Error adding new user and profile");

    expect(mockConnection.rollback).toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
  });
});
