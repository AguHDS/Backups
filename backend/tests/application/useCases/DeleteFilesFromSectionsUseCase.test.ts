import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeleteFilesFromSectionsUseCase } from "@/application/useCases/DeleteFilesFromSectionsUseCase.js";
import { type FileRepository } from "@/domain/ports/repositories/FileRepository.js";
import { type CloudinaryRemover } from "@/infraestructure/adapters/externalServices/CloudinaryRemover.js";
import { type StorageUsageRepository } from "@/domain/ports/repositories/StorageUsageRepository.js";
import { type SectionFilesPayload } from "@/shared/dtos/SectionAndFiles.js";
import { UserFile } from "@/domain/entities/UserFile.js";

describe("DeleteFilesFromSectionsUseCase", () => {
  const mockFileRepo: FileRepository = {
    save: vi.fn(),
    saveMany: vi.fn(),
    findBySectionId: vi.fn(),
    deleteFilesByPublicIds: vi.fn(),
  };

  const mockCloudinaryRemover: CloudinaryRemover = {
    deleteFilesByPublicIds: vi.fn(),
    deleteFolder: vi.fn(),
  };

  const mockStorageRepo: StorageUsageRepository = {
    getUsedStorage: vi.fn(),
    addToUsedStorage: vi.fn(),
    decreaseFromUsedStorage: vi.fn(),
    getMaxStorage: vi.fn(),
    getRemainingStorage: vi.fn(),
    tryReserveStorage: vi.fn(),
  };

  const useCase = new DeleteFilesFromSectionsUseCase(
    mockFileRepo,
    mockCloudinaryRemover,
    mockStorageRepo
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should delete files and decrease used storage only for current user", async () => {
    const userId = 1;

    const payload: SectionFilesPayload[] = [
      {
        sectionId: 123,
        publicIds: ["img1", "img2"],
      },
      {
        sectionId: 456,
        publicIds: ["img3"],
      },
    ];

    // Simulate deleted files with different users
    const deletedFiles: UserFile[] = [
      new UserFile("img1", "url1", "123", 1000, 1), // belongs to user
      new UserFile("img2", "url2", "123", 2000, 2), // belongs to other user
      new UserFile("img3", "url3", "456", 500, 1), // belongs to user
    ];

    (mockFileRepo.deleteFilesByPublicIds as any).mockResolvedValueOnce(
      deletedFiles.slice(0, 2)
    ); // first section
    (mockFileRepo.deleteFilesByPublicIds as any).mockResolvedValueOnce(
      deletedFiles.slice(2)
    ); // second section

    (mockCloudinaryRemover.deleteFilesByPublicIds as any).mockResolvedValue(
      undefined
    );
    (mockStorageRepo.decreaseFromUsedStorage as any).mockResolvedValue(
      undefined
    );

    await useCase.execute(userId, payload);

    expect(mockFileRepo.deleteFilesByPublicIds).toHaveBeenCalledTimes(2);
    expect(mockFileRepo.deleteFilesByPublicIds).toHaveBeenCalledWith([
      "img1",
      "img2",
    ]);
    expect(mockFileRepo.deleteFilesByPublicIds).toHaveBeenCalledWith(["img3"]);

    expect(mockCloudinaryRemover.deleteFilesByPublicIds).toHaveBeenCalledTimes(
      2
    );
    expect(mockCloudinaryRemover.deleteFilesByPublicIds).toHaveBeenCalledWith([
      "img1",
      "img2",
    ]);
    expect(mockCloudinaryRemover.deleteFilesByPublicIds).toHaveBeenCalledWith([
      "img3",
    ]);

    // Total of actual user = 1000 (img1) + 500 (img3) = 1500
    expect(mockStorageRepo.decreaseFromUsedStorage).toHaveBeenCalledWith(
      userId,
      1500
    );
  });

  it("should skip storage update if no matching user files", async () => {
    const userId = 99;

    const payload: SectionFilesPayload[] = [
      {
        sectionId: 4,
        publicIds: ["img1"],
      },
    ];

    // Deleted file belongs to other user
    const deletedFiles: UserFile[] = [
      new UserFile("img1", "url1", "4", 1000, 1),
    ];

    (mockFileRepo.deleteFilesByPublicIds as any).mockResolvedValueOnce(
      deletedFiles
    );
    (mockCloudinaryRemover.deleteFilesByPublicIds as any).mockResolvedValue(
      undefined
    );

    await useCase.execute(userId, payload);

    expect(mockStorageRepo.decreaseFromUsedStorage).not.toHaveBeenCalled();
  });

  it("should skip empty sections", async () => {
    const userId = 1;

    const payload: SectionFilesPayload[] = [
      { sectionId: 6, publicIds: [] },
      { sectionId: 3, publicIds: ["img1"] },
    ];

    const deletedFiles: UserFile[] = [new UserFile("img1", "url", "3", 300, 1)];

    (mockFileRepo.deleteFilesByPublicIds as any).mockResolvedValueOnce(
      deletedFiles
    );
    (mockCloudinaryRemover.deleteFilesByPublicIds as any).mockResolvedValue(
      undefined
    );
    (mockStorageRepo.decreaseFromUsedStorage as any).mockResolvedValue(
      undefined
    );

    await useCase.execute(userId, payload);

    expect(mockFileRepo.deleteFilesByPublicIds).toHaveBeenCalledTimes(1);
    expect(mockFileRepo.deleteFilesByPublicIds).toHaveBeenCalledWith(["img1"]);
  });
});
