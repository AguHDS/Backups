import { describe, it, expect, vi, beforeEach } from "vitest";
import { GetUserProfileUseCase } from "@/application/useCases/GetUserProfileUseCase.js";
import { ProfileRepository } from "@/domain/ports/repositories/ProfileRepository.js";
import { FileRepository } from "@/domain/ports/repositories/FileRepository.js";
import { UserProfile } from "@/domain/entities/UserProfile.js";
import { UserProfileSection } from "@/domain/entities/UserProfileSection.js";
import { UserFile } from "@/domain/entities/UserFile.js";

const mockProfileRepo = {
  getProfileByUsername:
    vi.fn<(username: string) => Promise<UserProfile | null>>(),
  getSectionsByUserId:
    vi.fn<
      (
        userId: string | number,
        onlyPublic?: boolean
      ) => Promise<UserProfileSection[]>
    >(),
  getSectionTitlesByIds: vi.fn(),
  updateProfile: vi.fn(),
  deleteSectionsByIds: vi.fn(),
  getFilesBySectionId: vi.fn(),
};

const mockFileRepo = {
  save: vi.fn(),
  saveMany: vi.fn(),
  findBySectionId: vi.fn<(sectionId: number) => Promise<UserFile[]>>(),
  deleteFilesByPublicIds: vi.fn(),
};

const useCase = new GetUserProfileUseCase(
  mockProfileRepo as unknown as ProfileRepository,
  mockFileRepo as unknown as FileRepository
);

describe("GetUserProfileUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return all sections if requester is owner", async () => {
    const userId = 1;
    const username = "subject_1";
    const requesterId = 1;

    const profile = new UserProfile(userId, "bio", 0);
    const sections = [new UserProfileSection(10, "title", "desc")];
    const files = [new UserFile("pub1", "url1", "10", 1000, userId)];

    mockProfileRepo.getProfileByUsername.mockResolvedValue(profile);
    mockProfileRepo.getSectionsByUserId.mockResolvedValue(sections);
    mockFileRepo.findBySectionId.mockResolvedValue(files);

    const result = await useCase.executeByUsername(username, requesterId);

    expect(result.isOwner).toBe(true);
    expect(result.profile.sections?.[0].files).toEqual(files);
    expect(mockProfileRepo.getSectionsByUserId).toHaveBeenCalledWith(
      userId,
      false
    );
  });

  it("should return only public sections if requester is not the owner", async () => {
    const userId = 1;
    const username = "subject_1";
    const requesterId = 999;

    const profile = new UserProfile(userId, "bio", 0);
    const sections = [new UserProfileSection(10, "public", "desc")];
    const files = [new UserFile("pub2", "url2", "10", 1000, userId)];

    mockProfileRepo.getProfileByUsername.mockResolvedValue(profile);
    mockProfileRepo.getSectionsByUserId.mockResolvedValue(sections);
    mockFileRepo.findBySectionId.mockResolvedValue(files);

    const result = await useCase.executeByUsername(username, requesterId);

    expect(result.isOwner).toBe(false);
    expect(result.profile.sections?.[0].files).toEqual(files);
    expect(mockProfileRepo.getSectionsByUserId).toHaveBeenCalledWith(
      userId,
      true
    );
  });

  it("should throw error if profile is not found", async () => {
    mockProfileRepo.getProfileByUsername.mockResolvedValue(null);

    await expect(
      useCase.executeByUsername("not_found_user", 1)
    ).rejects.toThrow("PROFILE_NOT_FOUND");
  });
});
