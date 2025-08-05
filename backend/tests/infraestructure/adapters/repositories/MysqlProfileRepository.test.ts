import { describe, it, expect, vi, beforeEach } from "vitest";
import { MysqlProfileRepository } from "@/infraestructure/adapters/repositories/MysqlProfileRepository.js";
import promisePool from "@/db/database.js";
import { UserProfileSection, UserProfile } from "@/domain/entities/index.js";

vi.mock("@/db/database", () => {
  const mockConnection = {
    beginTransaction: vi.fn(),
    commit: vi.fn(),
    rollback: vi.fn(),
    release: vi.fn(),
    execute: vi.fn(),
  };

  return {
    default: {
      execute: vi.fn(),
      getConnection: vi.fn(() => mockConnection),
      __mockConnection: mockConnection,
    },
  };
});

const mockedExecute = promisePool.execute as unknown as ReturnType<typeof vi.fn>;
const mockedConnection = (promisePool as any).__mockConnection;

describe("MysqlProfileRepository", () => {
  let repository: MysqlProfileRepository;

  beforeEach(() => {
    repository = new MysqlProfileRepository();
    vi.clearAllMocks();
  });

  it("should return UserProfile when user is found by username", async () => {
    mockedExecute.mockResolvedValueOnce([
      [
        {
          userId: 1,
          bio: "Bio",
          profile_pic: "pic.jpg",
          partner: "Test",
          friends: 42,
        },
      ],
    ]);

    const result = await repository.getProfileByUsername("testuser");

    expect(mockedExecute).toHaveBeenCalledWith(
      expect.stringContaining("SELECT u.id"),
      ["testuser"]
    );
    expect(result).toBeInstanceOf(UserProfile);
    expect(result?.bio).toBe("Bio");
    expect(result?.profilePic).toBe("pic.jpg");
    expect(result?.partner).toBe("Test");
    expect(result?.friendsCount).toBe(42);
  });

  it("should return null when no user is found by username", async () => {
    mockedExecute.mockResolvedValueOnce([[]]);

    const result = await repository.getProfileByUsername("nonexistent");

    expect(result).toBeNull();
  });

  it("should return UserProfile when user is found by ID", async () => {
    mockedExecute.mockResolvedValueOnce([
      [
        {
          bio: "Bio text",
          profile_pic: null,
          partner: null,
          friends: 3,
        },
      ],
    ]);

    const result = await repository.getProfileById(1);

    expect(result).toBeInstanceOf(UserProfile);
    expect(result?.bio).toBe("Bio text");
    expect(result?.profilePic).toBeUndefined();
    expect(result?.partner).toBeUndefined();
    expect(result?.friendsCount).toBe(3);
  });

  it("should return array of UserProfileSection with isPublic correctly mapped", async () => {
    mockedExecute.mockResolvedValueOnce([
      [
        { id: 1, fk_users_id: 1, title: "A", description: "D", is_public: 1 },
        { id: 2, fk_users_id: 1, title: "B", description: "E", is_public: 0 },
      ],
    ]);

    const result = await repository.getSectionsByUserId(1);

    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(UserProfileSection);
    expect(result[0].isPublic).toBe(true);
    expect(result[1].isPublic).toBe(false);
  });

  it("should return empty array if no sectionIds are passed to getSectionTitlesByIds", async () => {
    const result = await repository.getSectionTitlesByIds([]);
    expect(result).toEqual([]);
  });

  it("should return section titles by ids", async () => {
    mockedExecute.mockResolvedValueOnce([
      [
        { id: 1, title: "First" },
        { id: 2, title: "Second" },
      ],
    ]);

    const result = await repository.getSectionTitlesByIds([1, 2]);

    expect(result).toEqual([
      { id: 1, title: "First" },
      { id: 2, title: "Second" },
    ]);
  });

  it("should return public IDs from sections", async () => {
    mockedExecute.mockResolvedValueOnce([
      [
        { public_id: "abc123" },
        { public_id: "def456" },
      ],
    ]);

    const result = await repository.getFilesBySectionId([1, 2]);
    expect(result).toEqual(["abc123", "def456"]);
  });

  it("should return empty array when no section IDs are given to getFilesBySectionId", async () => {
    const result = await repository.getFilesBySectionId([]);
    expect(result).toEqual([]);
  });

  it("should insert and update sections and return new IDs", async () => {
    mockedConnection.execute
      .mockResolvedValueOnce([{ affectedRows: 1 }]) // update bio
      .mockResolvedValueOnce([{ affectedRows: 1 }]) // update existing section
      .mockResolvedValueOnce([{ insertId: 999 }]);  // insert new section

    const result = await repository.updateProfile(
      "New bio",
      [
        new UserProfileSection(1, "Updated", "Desc", undefined, true),
        new UserProfileSection(0, "New", "Desc", undefined, false),
      ],
      "1"
    );

    expect(mockedConnection.beginTransaction).toHaveBeenCalled();
    expect(mockedConnection.commit).toHaveBeenCalled();
    expect(result).toEqual({ newlyCreatedSections: [{ tempId: 0, newId: 999 }] });
  });

  it("should rollback if bio update fails", async () => {
    mockedConnection.execute.mockResolvedValueOnce([{ affectedRows: 0 }]);

    await expect(
      repository.updateProfile("bio", [], "1")
    ).rejects.toThrow("No profile found for the given user ID");

    expect(mockedConnection.rollback).toHaveBeenCalled();
  });

  it("should delete sections by IDs", async () => {
    mockedConnection.execute.mockResolvedValueOnce([]);

    await expect(repository.deleteSectionsByIds([1, 2], "1")).resolves.toBeUndefined();

    expect(mockedConnection.beginTransaction).toHaveBeenCalled();
    expect(mockedConnection.commit).toHaveBeenCalled();
    expect(mockedConnection.execute).toHaveBeenCalledWith(
      expect.stringContaining("DELETE FROM users_profile_sections"),
      [1, 2, "1"]
    );
  });

  it("should return early if sectionIds is empty in deleteSectionsByIds", async () => {
    await repository.deleteSectionsByIds([], "1");
    expect(mockedConnection.beginTransaction).not.toHaveBeenCalled();
  });
});
