import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { UploadFilesUseCase } from "@/application/useCases/UploadFilesUseCase.js";
import type {
  CloudinaryFileUploader,
  CloudinaryUploadResponse,
} from "@/domain/ports/externalServices/CloudinaryFileUploader.js";
import type { FileRepository } from "@/domain/ports/repositories/FileRepository.js";
import { UserFile } from "@/domain/entities/UserFile.js";
import type { MysqlStorageUsageRepository } from "@/infraestructure/adapters/repositories/MysqlStorageUsageRepository.js";

describe("UploadFilesUseCase", () => {
  let uploader: CloudinaryFileUploader;
  let fileRepo: FileRepository;
  let storageRepo: MysqlStorageUsageRepository;
  let useCase: UploadFilesUseCase;

  beforeEach(() => {
    uploader = {
      upload: vi.fn(),
    };

    fileRepo = {
      save: vi.fn(),
      saveMany: vi.fn(),
      findBySectionId: vi.fn(),
      deleteFilesByPublicIds: vi.fn(),
    };

    storageRepo = {
      addToUsedStorage: vi.fn(),
      decreaseFromUsedStorage: vi.fn(),
      getUsedStorage: vi.fn(),
    } as unknown as MysqlStorageUsageRepository;

    useCase = new UploadFilesUseCase(uploader, fileRepo, storageRepo);
  });

  it("should throw when no files are provided", async () => {
    await expect(
      useCase.execute(
        undefined as unknown as Express.Multer.File[],
        "10",
        "Photos",
        123
      )
    ).rejects.toThrow("No files provided");
  });

  it("should throw when files array is empty", async () => {
    await expect(useCase.execute([], "10", "Photos", 123)).rejects.toThrow(
      "No files provided"
    );
  });

  it("should upload files, persist them, update storage usage and return entities", async () => {
    const files = [
      { originalname: "a.png" },
      { originalname: "b.jpg" },
    ] as unknown as Express.Multer.File[];

    const sectionId = "42";
    const sectionTitle = "Gallery";
    const userId = 4;

    const uploaded: CloudinaryUploadResponse[] = [
      { public_id: "pub/a", url: "http://cnd/a.png", sizeInBytes: 1500 },
      { public_id: "pub/b", url: "http://cnd/b.jpg", sizeInBytes: 2500 },
    ];

    (uploader.upload as Mock).mockResolvedValue(uploaded);
    (fileRepo.saveMany as Mock).mockResolvedValue(undefined);
    (storageRepo.addToUsedStorage as unknown as Mock).mockResolvedValue(
      undefined
    );

    const result = await useCase.execute(
      files,
      sectionId,
      sectionTitle,
      userId
    );

    // verify correct args when calling uploader
    expect(uploader.upload).toHaveBeenCalledWith(
      files,
      sectionId,
      sectionTitle
    );

    // verifies that saveMany was called only once with UserFile entities
    expect(fileRepo.saveMany).toHaveBeenCalledTimes(1);
    const savedArg = (fileRepo.saveMany as Mock).mock.calls[0][0] as UserFile[];
    expect(savedArg).toHaveLength(uploaded.length);
    savedArg.forEach((f) => {
      expect(f).toBeInstanceOf(UserFile);
    });

    // verify addition of bytes
    const expectedTotal = uploaded.reduce((s, f) => s + f.sizeInBytes, 0);
    expect(storageRepo.addToUsedStorage).toHaveBeenCalledWith(
      userId,
      expectedTotal
    );

    // should return same created entities
    expect(result).toHaveLength(2);
    // If UserFile exposes public fields, validates 1:1 mapping
    // (if your fields are private, remove these lines and leave the checks above)
    expect(result[0].sizeInBytes).toBe(1500);
    expect(result[1].sizeInBytes).toBe(2500);
  });

  it("should handle a single file upload correctly", async () => {
    const files = [
      { originalname: "only.png" },
    ] as unknown as Express.Multer.File[];
    const sectionId = "7";
    const sectionTitle = "Avatar";
    const userId = "u-1";

    const uploaded: CloudinaryUploadResponse[] = [
      { public_id: "pub/only", url: "http://cnd/only.png", sizeInBytes: 4096 },
    ];

    (uploader.upload as Mock).mockResolvedValue(uploaded);
    (fileRepo.saveMany as Mock).mockResolvedValue(undefined);

    const result = await useCase.execute(
      files,
      sectionId,
      sectionTitle,
      userId
    );

    expect(uploader.upload).toHaveBeenCalledWith(
      files,
      sectionId,
      sectionTitle
    );
    expect(fileRepo.saveMany).toHaveBeenCalledTimes(1);
    expect(storageRepo.addToUsedStorage).toHaveBeenCalledWith(userId, 4096);

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(UserFile);
  });
});
