import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeleteSectionsUseCase } from "@/application/useCases/DeleteSectionsUseCase.js";
import type { ProfileRepository } from "@/domain/ports/repositories/ProfileRepository.js";
import type { CloudinaryRemover } from "@/infraestructure/adapters/externalServices/CloudinaryRemover.js";

describe("DeleteSectionsUseCase", () => {
  const mockProfileRepo: ProfileRepository = {
    getProfileByUsername: vi.fn(),
    getSectionsByUserId: vi.fn(),
    updateProfile: vi.fn(),
    deleteSectionsByIds: vi.fn(),
    getFilesBySectionId: vi.fn(),
    getSectionTitlesByIds: vi.fn(),
  };

  const mockCloudinaryRemover: CloudinaryRemover = {
    deleteFilesByPublicIds: vi.fn(),
    deleteFolder: vi.fn(),
  };

  const useCase = new DeleteSectionsUseCase(
    mockProfileRepo,
    mockCloudinaryRemover
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw if sectionIds is empty", async () => {
    await expect(useCase.execute([], 1, "john")).rejects.toThrow(
      "NO_SECTIONS_ID"
    );
  });

  it("should delete files, folders, and sections correctly", async () => {
    const userId = 42;
    const username = "john";
    const sectionIds = [1, 2];

    const mockPublicIds = ["file1", "file2"];
    const mockSectionTitles = [
      { id: 1, title: "Work" },
      { id: 2, title: "Projects" },
    ];

    (mockProfileRepo.getFilesBySectionId as any).mockResolvedValue(
      mockPublicIds
    );
    (mockCloudinaryRemover.deleteFilesByPublicIds as any).mockResolvedValue(
      undefined
    );
    (mockProfileRepo.getSectionTitlesByIds as any).mockResolvedValue(
      mockSectionTitles
    );
    (mockCloudinaryRemover.deleteFolder as any).mockResolvedValue(undefined);
    (mockProfileRepo.deleteSectionsByIds as any).mockResolvedValue(undefined);

    await useCase.execute(sectionIds, userId, username);

    expect(mockProfileRepo.getFilesBySectionId).toHaveBeenCalledWith(
      sectionIds
    );
    expect(mockCloudinaryRemover.deleteFilesByPublicIds).toHaveBeenCalledWith(
      mockPublicIds
    );
    expect(mockProfileRepo.getSectionTitlesByIds).toHaveBeenCalledWith(
      sectionIds
    );

    expect(mockCloudinaryRemover.deleteFolder).toHaveBeenCalledWith(
      `user_files/john (id: 42)/section: Work (id: 1)`
    );
    expect(mockCloudinaryRemover.deleteFolder).toHaveBeenCalledWith(
      `user_files/john (id: 42)/section: Projects (id: 2)`
    );

    expect(mockProfileRepo.deleteSectionsByIds).toHaveBeenCalledWith(
      sectionIds,
      userId
    );
  });
});
