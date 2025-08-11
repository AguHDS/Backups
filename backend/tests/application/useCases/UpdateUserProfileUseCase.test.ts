import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { UpdateUserProfileUseCase } from "@/application/useCases/UpdateUserProfileUseCase.js";
import type { ProfileRepository } from "@/domain/ports/repositories/ProfileRepository.js";
import type { UserProfileSection } from "@/domain/entities/UserProfileSection.js";

describe("UpdateUserProfileUseCase", () => {
  let mockRepo: ProfileRepository;
  let useCase: UpdateUserProfileUseCase;

  beforeEach(() => {
    mockRepo = {
      getProfileByUsername: vi.fn(),
      getSectionsByUserId: vi.fn(),
      getSectionTitlesByIds: vi.fn(),
      updateProfile: vi.fn(),
      deleteSectionsByIds: vi.fn(),
      getFilesBySectionId: vi.fn(),
    };

    useCase = new UpdateUserProfileUseCase(mockRepo);
  });

  it("should throw INVALID_BIO if bio is empty", async () => {
    await expect(
      useCase.execute("", [], "123", "user")
    ).rejects.toThrowError("INVALID_BIO");
  });

  it("should throw INVALID_BIO if bio is not a string", async () => {
    await expect(
      useCase.execute(undefined as unknown as string, [], "123", "user")
    ).rejects.toThrowError("INVALID_BIO");
  });

  it("should throw INVALID_SECTIONS if sections is not an array", async () => {
    await expect(
      useCase.execute("bio text", null as unknown as UserProfileSection[], "123", "user")
    ).rejects.toThrowError("INVALID_SECTIONS");
  });

  it("should throw LIMIT_EXCEEDED_FOR_USER_ROLE if user role has more than one section", async () => {
    const sections: UserProfileSection[] = [
      { id: 1, title: "Section 1", isPublic: true },
      { id: 2, title: "Section 2", isPublic: true }
    ] as UserProfileSection[];

    await expect(
      useCase.execute("bio text", sections, "123", "user")
    ).rejects.toThrowError("LIMIT_EXCEEDED_FOR_USER_ROLE");
  });

  it("should call repository updateProfile with correct params", async () => {
    const sections: UserProfileSection[] = [
      { id: 1, title: "Section 1", isPublic: true }
    ] as UserProfileSection[];

    const mockResponse = { newlyCreatedSections: [{ tempId: 99, newId: 101 }] };
    (mockRepo.updateProfile as Mock).mockResolvedValue(mockResponse);

    const result = await useCase.execute("bio text", sections, "123", "admin");

    expect(mockRepo.updateProfile).toHaveBeenCalledWith("bio text", sections, "123");
    expect(result).toEqual(mockResponse);
  });
});