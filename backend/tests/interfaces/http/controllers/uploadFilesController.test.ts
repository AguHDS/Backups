import { describe, it, expect, vi, beforeEach } from "vitest";
import { uploadFilesController } from "@/interfaces/http/controllers/uploadFilesController.js";
import type { Request, Response } from "express";
import { UploadFilesUseCase } from "@/application/useCases/UploadFilesUseCase.js";
import { UserFile } from "@/domain/entities/UserFile.js";
import { Readable } from "stream";
import type { MockInstance } from "vitest";

vi.mock("@/infraestructure/adapters/externalServices/CloudinaryUploader.js", () => ({
  CloudinaryUploader: vi.fn(),
}));
vi.mock("@/infraestructure/adapters/repositories/MysqlFileRepository.js", () => ({
  MysqlFileRepository: vi.fn(),
}));
vi.mock("@/infraestructure/adapters/repositories/MysqlStorageUsageRepository.js", () => ({
  MysqlStorageUsageRepository: vi.fn(),
}));

vi.mock("@/application/useCases/UploadFilesUseCase.js", () => {
  return {
    UploadFilesUseCase: vi.fn().mockImplementation(() => ({
      execute: vi.fn(),
    })),
  };
});

describe("uploadFilesController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let json: ReturnType<typeof vi.fn>;
  let status: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    json = vi.fn();
    status = vi.fn().mockReturnValue({ json });

    const mockedFile: Express.Multer.File = {
      fieldname: "files",
      originalname: "file1.jpg",
      encoding: "7bit",
      mimetype: "image/jpeg",
      size: 1024,
      destination: "uploads/",
      filename: "file1.jpg",
      path: "uploads/file1.jpg",
      buffer: Buffer.from("test"),
      stream: Readable.from("file content"),
    };

    req = {
      baseUserData: {
        id: 1,
        name: "JohnDoe",
        role: "user",
      },
      query: {
        sectionId: "section123",
        sectionTitle: "Projects",
      },
      files: [mockedFile],
    };

    res = {
      status,
    };

    vi.clearAllMocks();
  });

  it("should call use case and return uploaded files", async () => {
    const expectedFiles: UserFile[] = [
      new UserFile("abc123", "http://cloudinary.com/file.jpg", "section123", 1024, 1),
    ];

    const UploadFilesUseCaseMock = UploadFilesUseCase as unknown as MockInstance;
    const executeMock = vi.fn().mockResolvedValue(expectedFiles);
    UploadFilesUseCaseMock.mockImplementation(() => ({
      execute: executeMock,
    }));

    await uploadFilesController(req as Request, res as Response);

    expect(UploadFilesUseCase).toHaveBeenCalled();
    expect(executeMock).toHaveBeenCalledWith(
      req.files,
      "section123",
      "Projects",
      1
    );

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ files: expectedFiles });
  });

  it("should return 500 on failure", async () => {
    const UploadFilesUseCaseMock = UploadFilesUseCase as unknown as MockInstance;
    const executeMock = vi.fn().mockRejectedValue(new Error("Upload failed"));
    UploadFilesUseCaseMock.mockImplementation(() => ({
      execute: executeMock,
    }));

    await uploadFilesController(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      message: "Upload failed",
    });
  });
});
