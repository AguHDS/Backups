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
  let uploader: CloudinaryFileUploader & {
    uploadFilesToSection: Mock;
    uploadProfilePicture: Mock;
    deleteProfilePicture: Mock;
    deleteByPublicIds: Mock;
  };
  
  let fileRepo: FileRepository;
  let storageRepo: MysqlStorageUsageRepository;
  let useCase: UploadFilesUseCase;

  beforeEach(() => {
    uploader = {
      uploadFilesToSection: vi.fn(),
      uploadProfilePicture: vi.fn(),
      deleteProfilePicture: vi.fn(),
      deleteByPublicIds: vi.fn(),
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
      getMaxStorage: vi.fn(),
      getRemainingStorage: vi.fn(),
      tryReserveStorage: vi.fn(),
    } as unknown as MysqlStorageUsageRepository;

    useCase = new UploadFilesUseCase(uploader, fileRepo, storageRepo);
    vi.clearAllMocks();
  });

  it("throws when no files are provided (undefined)", async () => {
    await expect(
      useCase.execute(
        undefined as unknown as Express.Multer.File[],
        "10",
        "Photos",
        123
      )
    ).rejects.toThrow("No files provided");
  });

  it("throws when files array is empty", async () => {
    await expect(useCase.execute([], "10", "Photos", 123)).rejects.toThrow(
      "No files provided"
    );
  });

  it("throws when total incoming size is invalid (<= 0)", async () => {
    const files = [
      { originalname: "a.png", size: 0 },
      { originalname: "b.jpg", size: 0 },
    ] as unknown as Express.Multer.File[];

    await expect(useCase.execute(files, "42", "Gallery", 4)).rejects.toThrow(
      "Invalid files payload"
    );
  });

  it("happy path: reserves exactly incoming bytes, uploads, saves metadata and returns entities (confirmed == incoming)", async () => {
    const files = [
      { originalname: "a.png", size: 1500 },
      { originalname: "b.jpg", size: 2500 },
    ] as unknown as Express.Multer.File[];
    const sectionId = "42";
    const sectionTitle = "Gallery";
    const userId = 4;
    const incomingBytes = 4000;

    const uploaded: CloudinaryUploadResponse[] = [
      { public_id: "pub/a", sizeInBytes: 1500 },
      { public_id: "pub/b", sizeInBytes: 2500 },
    ];

    (storageRepo.getRemainingStorage as unknown as Mock).mockResolvedValue(
      999999
    );
    (storageRepo.tryReserveStorage as unknown as Mock).mockResolvedValue(true);
    (uploader.uploadFilesToSection as Mock).mockResolvedValue(uploaded);
    (fileRepo.saveMany as Mock).mockResolvedValue(undefined);

    const result = await useCase.execute(
      files,
      sectionId,
      sectionTitle,
      userId
    );

    expect(storageRepo.getRemainingStorage).toHaveBeenCalledWith(userId);
    expect(storageRepo.tryReserveStorage).toHaveBeenCalledWith(
      userId,
      incomingBytes
    );
    expect(uploader.uploadFilesToSection).toHaveBeenCalledWith(
      files,
      sectionId,
      sectionTitle
    );

    expect(storageRepo.decreaseFromUsedStorage).not.toHaveBeenCalled();

    expect(fileRepo.saveMany).toHaveBeenCalledTimes(1);
    const savedArg = (fileRepo.saveMany as Mock).mock.calls[0][0] as UserFile[];
    expect(savedArg).toHaveLength(uploaded.length);
    savedArg.forEach((f) => expect(f).toBeInstanceOf(UserFile));

    expect(result).toHaveLength(2);
    expect(result[0].sizeInBytes).toBe(1500);
    expect(result[1].sizeInBytes).toBe(2500);
  });

  it("pre-check: throw STORAGE_QUOTA_EXCEEDED with details if incoming > remaining (does not rise)", async () => {
    const files = [
      { originalname: "a.png", size: 6000 },
      { originalname: "b.jpg", size: 6000 },
    ] as unknown as Express.Multer.File[];
    const userId = 99;

    (storageRepo.getRemainingStorage as unknown as Mock).mockResolvedValue(
      5000
    );
    (storageRepo.getUsedStorage as unknown as Mock).mockResolvedValue(12000);
    (storageRepo.getMaxStorage as unknown as Mock).mockResolvedValue(15000);

    await expect(
      useCase.execute(files, "X", "Over", userId)
    ).rejects.toMatchObject({
      message: "Storage quota exceeded",
      details: {
        code: "STORAGE_QUOTA_EXCEEDED",
        used: 12000,
        limit: 15000,
        remaining: 5000,
        attempted: 12000,
      },
    });

    expect(uploader.uploadFilesToSection).not.toHaveBeenCalled();
    expect(storageRepo.tryReserveStorage).not.toHaveBeenCalled();
  });

  it("race: reservation fails even though remaining was sufficient -> launches with fresh data, does not upload", async () => {
    const files = [
      { originalname: "a.png", size: 3000 },
      { originalname: "b.jpg", size: 2000 },
    ] as unknown as Express.Multer.File[];
    const userId = 7;

    (storageRepo.getRemainingStorage as unknown as Mock).mockResolvedValue(
      999999
    );
    (storageRepo.tryReserveStorage as unknown as Mock).mockResolvedValue(false);
    (storageRepo.getUsedStorage as unknown as Mock).mockResolvedValue(8000);
    (storageRepo.getMaxStorage as unknown as Mock).mockResolvedValue(10000);
    (storageRepo.getRemainingStorage as unknown as Mock).mockResolvedValue(
      2000
    );

    await expect(
      useCase.execute(files, "S", "T", userId)
    ).rejects.toMatchObject({
      message: "Storage quota exceeded",
      details: {
        code: "STORAGE_QUOTA_EXCEEDED",
        used: 8000,
        limit: 10000,
        remaining: 2000,
        attempted: 5000,
      },
    });

    expect(uploader.uploadFilesToSection).not.toHaveBeenCalled();
  });

  it("confirmed > incoming: extra reserve OK and the complete one", async () => {
    const files = [
      { originalname: "a.png", size: 1000 },
      { originalname: "b.jpg", size: 1000 },
    ] as unknown as Express.Multer.File[];
    const userId = 1;
    const incomingBytes = 2000;

    const uploaded: CloudinaryUploadResponse[] = [
      { public_id: "pub/a", sizeInBytes: 1500 },
      { public_id: "pub/b", sizeInBytes: 1000 },
    ];
    const confirmedBytes = 2500;
    const extra = confirmedBytes - incomingBytes;

    (storageRepo.getRemainingStorage as unknown as Mock).mockResolvedValue(
      999999
    );
    (storageRepo.tryReserveStorage as unknown as Mock)
      .mockResolvedValueOnce(true) // initial reserve
      .mockResolvedValueOnce(true); // extra reserve
    (uploader.uploadFilesToSection as Mock).mockResolvedValue(uploaded);
    (fileRepo.saveMany as Mock).mockResolvedValue(undefined);

    const result = await useCase.execute(files, "S", "T", userId);

    expect(storageRepo.tryReserveStorage).toHaveBeenNthCalledWith(
      1,
      userId,
      incomingBytes
    );
    expect(storageRepo.tryReserveStorage).toHaveBeenNthCalledWith(
      2,
      userId,
      extra
    );
    expect(storageRepo.decreaseFromUsedStorage).not.toHaveBeenCalled();
    expect(result).toHaveLength(2);
  });

  it("confirmed < incoming: must release the reserved surplus", async () => {
    const files = [
      { originalname: "a.png", size: 2000 },
      { originalname: "b.jpg", size: 2000 },
    ] as unknown as Express.Multer.File[];
    const userId = 5;
    const incomingBytes = 4000;

    const uploaded: CloudinaryUploadResponse[] = [
      { public_id: "pub/a", sizeInBytes: 1000 },
      { public_id: "pub/b", sizeInBytes: 500 },
    ];
    const confirmed = 1500;
    const surplus = incomingBytes - confirmed;

    (storageRepo.getRemainingStorage as unknown as Mock).mockResolvedValue(
      999999
    );
    (storageRepo.tryReserveStorage as unknown as Mock).mockResolvedValue(true);
    (uploader.uploadFilesToSection as Mock).mockResolvedValue(uploaded);
    (fileRepo.saveMany as Mock).mockResolvedValue(undefined);

    await useCase.execute(files, "S", "T", userId);

    expect(storageRepo.decreaseFromUsedStorage).toHaveBeenCalledWith(
      userId,
      surplus
    );
  });

  it("uploader throws -> releases reservation and repeats error", async () => {
    const files = [
      { originalname: "a.png", size: 1024 },
      { originalname: "b.jpg", size: 2048 },
    ] as unknown as Express.Multer.File[];
    const userId = 2;
    const incomingBytes = 3072;

    (storageRepo.getRemainingStorage as unknown as Mock).mockResolvedValue(
      999999
    );
    (storageRepo.tryReserveStorage as unknown as Mock).mockResolvedValue(true);
    (uploader.uploadFilesToSection as Mock).mockRejectedValue(
      new Error("cloud fail")
    );

    await expect(useCase.execute(files, "S", "T", userId)).rejects.toThrow(
      "cloud fail"
    );

    expect(storageRepo.decreaseFromUsedStorage).toHaveBeenCalledWith(
      userId,
      incomingBytes
    );
    expect(fileRepo.saveMany).not.toHaveBeenCalled();
  });

  it("saveMany throws -> deletes uploads, releases reservation and relaunches", async () => {
    const files = [
      { originalname: "a.png", size: 1000 },
      { originalname: "b.jpg", size: 1000 },
    ] as unknown as Express.Multer.File[];
    const userId = 11;
    const incomingBytes = 2000;

    const uploaded: CloudinaryUploadResponse[] = [
      { public_id: "pub/a", sizeInBytes: 1000 },
      { public_id: "pub/b", sizeInBytes: 1000 },
    ];

    (storageRepo.getRemainingStorage as unknown as Mock).mockResolvedValue(
      999999
    );
    (storageRepo.tryReserveStorage as unknown as Mock).mockResolvedValue(true);
    (uploader.uploadFilesToSection as Mock).mockResolvedValue(uploaded);
    (fileRepo.saveMany as Mock).mockRejectedValue(new Error("db fail"));

    await expect(useCase.execute(files, "S", "T", userId)).rejects.toThrow(
      "db fail"
    );

    expect(uploader.deleteByPublicIds).toHaveBeenCalledWith(["pub/a", "pub/b"]);
    expect(storageRepo.decreaseFromUsedStorage).toHaveBeenCalledWith(
      userId,
      incomingBytes
    );
  });
});
