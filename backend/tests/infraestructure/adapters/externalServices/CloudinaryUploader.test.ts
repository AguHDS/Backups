import { describe, it, expect, vi, beforeEach } from "vitest";
import { CloudinaryUploader } from "@/infraestructure/adapters/externalServices/CloudinaryUploader.js";

vi.mock("@/services/cloudinary.js", async () => {
  const actual = await vi.importActual<
    typeof import("@/services/cloudinary.js")
  >("@/services/cloudinary.js");
  return {
    ...actual,
    cloudinary: {
      uploader: {
        upload_stream: vi.fn(),
      },
    },
  };
});

vi.mock("streamifier", () => ({
  default: {
    createReadStream: vi.fn(),
  },
}));

import { cloudinary } from "@/services/cloudinary.js";
import streamifier from "streamifier";

const mockedCloudinaryUploader = cloudinary.uploader
  .upload_stream as unknown as ReturnType<typeof vi.fn>;
const mockedStreamifier = streamifier as unknown as {
  createReadStream: ReturnType<typeof vi.fn>;
};

describe("CloudinaryUploader", () => {
  const fakeFile: Express.Multer.File = {
    fieldname: "file",
    originalname: "test.png",
    encoding: "7bit",
    mimetype: "image/png",
    size: 12345,
    buffer: Buffer.from("test"),
    stream: null as any,
    destination: "",
    filename: "",
    path: "",
  };

  const uploader = new CloudinaryUploader("alex", "123");

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should upload files and return correct response", async () => {
    const mockPipe = vi.fn();
    mockedStreamifier.createReadStream.mockReturnValue({ pipe: mockPipe });

    mockedCloudinaryUploader.mockImplementation((_options, cb) => {
      setTimeout(() => {
        cb(null, {
          public_id: "public-id-1",
          bytes: 12345,
        });
      }, 0);
      return {} as any;
    });

    const result = await uploader.uploadFilesToSection(
      [fakeFile],
      "section123",
      "Profile Images"
    );

    expect(result).toEqual([
      {
        public_id: "public-id-1",
        sizeInBytes: 12345,
      },
    ]);

    expect(mockedCloudinaryUploader).toHaveBeenCalledTimes(1);
    expect(mockPipe).toHaveBeenCalled();
  });

  it("should reject if cloudinary upload fails", async () => {
    mockedStreamifier.createReadStream.mockReturnValue({ pipe: vi.fn() });

    mockedCloudinaryUploader.mockImplementation((_options, cb) => {
      setTimeout(() => {
        cb(new Error("Upload failed"), null);
      }, 0);
      return {} as any;
    });

    await expect(
      uploader.uploadFilesToSection([fakeFile], "section123", "Profile Images")
    ).rejects.toThrow("Upload failed");

    expect(mockedCloudinaryUploader).toHaveBeenCalledTimes(1);
  });
});
