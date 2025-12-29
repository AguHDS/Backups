import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeleteSectionsUseCase } from "@/application/useCases/DeleteSectionsUseCase.js";
import type { ProfileRepository } from "@/domain/ports/repositories/ProfileRepository.js";
import type { FileRepository } from "@/domain/ports/repositories/FileRepository.js";
import type { StorageUsageRepository } from "@/domain/ports/repositories/StorageUsageRepository.js";
import type { CloudinaryRemover } from "@/infraestructure/adapters/externalServices/CloudinaryRemover.js";

describe("DeleteSectionsUseCase", () => {
  const mockProfileRepo: ProfileRepository = {
    getProfileByUsername: vi.fn(),
    getProfileById: vi.fn(),
    getSectionsByUserId: vi.fn(),
    updateProfile: vi.fn(),
    deleteSectionsByIds: vi.fn(),
    getFilesBySectionId: vi.fn(),
    getSectionTitlesByIds: vi.fn(),
    updateBio: vi.fn(),
    updateSections: vi.fn(),
    updateProfilePicture: vi.fn(),
  };

  const mockFileRepo: FileRepository = {
    getFilesWithSizeBySectionId: vi.fn(),
  } as any;

  const mockCloudinaryRemover: CloudinaryRemover = {
    deleteFilesByPublicIds: vi.fn(),
    deleteFoldersBySectionId: vi.fn(),
  } as any;

  const mockStorageUsageRepo: StorageUsageRepository = {
    decreaseFromUsedStorage: vi.fn(),
  } as any;

  const useCase = new DeleteSectionsUseCase(
    mockProfileRepo,
    mockFileRepo,
    mockCloudinaryRemover,
    mockStorageUsageRepo
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

    const mockFiles = [
      { public_id: "file1", size_in_bytes: 1000 },
      { public_id: "file2", size_in_bytes: 2000 },
    ];

    (mockFileRepo.getFilesWithSizeBySectionId as any).mockResolvedValue(
      mockFiles
    );
    (mockCloudinaryRemover.deleteFilesByPublicIds as any).mockResolvedValue(
      undefined
    );
    (mockCloudinaryRemover.deleteFoldersBySectionId as any).mockResolvedValue(
      undefined
    );
    (mockProfileRepo.deleteSectionsByIds as any).mockResolvedValue(undefined);
    (mockStorageUsageRepo.decreaseFromUsedStorage as any).mockResolvedValue(
      undefined
    );

    await useCase.execute(sectionIds, userId, username);

    expect(mockFileRepo.getFilesWithSizeBySectionId).toHaveBeenCalledWith(
      sectionIds
    );
    expect(mockCloudinaryRemover.deleteFilesByPublicIds).toHaveBeenCalledWith([
      "file1",
      "file2",
    ]);

    expect(mockCloudinaryRemover.deleteFoldersBySectionId).toHaveBeenCalledWith(
      username,
      userId,
      1
    );
    expect(mockCloudinaryRemover.deleteFoldersBySectionId).toHaveBeenCalledWith(
      username,
      userId,
      2
    );

    expect(mockProfileRepo.deleteSectionsByIds).toHaveBeenCalledWith(
      sectionIds,
      userId
    );
    expect(mockStorageUsageRepo.decreaseFromUsedStorage).toHaveBeenCalledWith(
      userId,
      3000
    );
  });
});
