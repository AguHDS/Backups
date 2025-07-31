import { describe, it, expect, vi, beforeEach } from "vitest";
import { MysqlFileRepository } from "@/infraestructure/adapters/repositories/MysqlFileRepository.js";
import { UserFile } from "@/domain/entities/UserFile.js";

vi.mock("@/db/database.js", () => ({
  default: {
    execute: vi.fn(),
    query: vi.fn(),
  },
}));

import promisePool from "@/db/database.js";

const mockedExecute = promisePool.execute as unknown as ReturnType<typeof vi.fn>;
const mockedQuery = promisePool.query as unknown as ReturnType<typeof vi.fn>;

describe("MysqlFileRepository", () => {
  const repository = new MysqlFileRepository();

  const sampleFile = new UserFile("pid123", "url", "sec1", 999, 5);//etestear

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should save a single file", async () => {
    await repository.save(sampleFile);
    expect(mockedExecute).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO users_files"),
      [sampleFile.publicId, sampleFile.url, sampleFile.sectionId, sampleFile.sizeInBytes, sampleFile.userId]
    );
  });

  it("should save many files", async () => {
    const files = [
      new UserFile("id1", "url1", "s1", 100, 1),
      new UserFile("id2", "url2", "s2", 200, 2),
    ];

    await repository.saveMany(files);

    expect(mockedQuery).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO users_files"),
      [[
        ["id1", "url1", "s1", 100, 1],
        ["id2", "url2", "s2", 200, 2]
      ]]
    );
  });

  it("should skip saveMany if array is empty", async () => {
    await repository.saveMany([]);
    expect(mockedQuery).not.toHaveBeenCalled();
  });

  it("should find files by section ID", async () => {
    const dbRows = [
      { public_id: "p1", url: "u1", section_id: "s1", size_in_bytes: 10, user_id: 1 },
      { public_id: "p2", url: "u2", section_id: "s1", size_in_bytes: 20, user_id: 1 },
    ];

    mockedExecute.mockResolvedValueOnce([dbRows]);

    const result = await repository.findBySectionId(1);

    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(UserFile);
    expect(result[0].publicId).toBe("p1");
    expect(mockedExecute).toHaveBeenCalledWith(
      expect.stringContaining("FROM users_files"),
      [1]
    );
  });

  it("should delete files by public IDs and return them", async () => {
    const publicIds = ["pid1", "pid2"];
    const dbRows = [
      { public_id: "pid1", url: "u1", section_id: "s1", size_in_bytes: 10, user_id: 1 },
    ];

    mockedExecute
      .mockResolvedValueOnce([dbRows]) // select
      .mockResolvedValueOnce([]);      // delete

    const result = await repository.deleteFilesByPublicIds(publicIds);

    expect(mockedExecute).toHaveBeenCalledTimes(2);
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(UserFile);
    expect(result[0].publicId).toBe("pid1");
  });

  it("should return empty array if no public IDs to delete", async () => {
    const result = await repository.deleteFilesByPublicIds([]);
    expect(result).toEqual([]);
    expect(mockedExecute).not.toHaveBeenCalled();
  });
});
