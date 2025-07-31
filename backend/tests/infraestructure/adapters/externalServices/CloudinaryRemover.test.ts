import { describe, it, expect, vi, beforeEach } from "vitest";
import { CloudinaryRemover } from "@/infraestructure/adapters/externalServices/CloudinaryRemover.js";
import { v2 as cloudinary } from "cloudinary";

vi.mock("cloudinary", () => ({
  v2: {
    uploader: {
      destroy: vi.fn(),
    },
    api: {
      delete_folder: vi.fn(),
    },
  },
}));

describe("CloudinaryRemover", () => {
  const remover = new CloudinaryRemover();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("deleteFilesByPublicIds", () => {
    it("should call destroy for each publicId", async () => {
      const publicIds = ["img1", "img2", "img3"];

      (
        cloudinary.uploader.destroy as ReturnType<typeof vi.fn>
      ).mockResolvedValue({});

      await remover.deleteFilesByPublicIds(publicIds);

      expect(cloudinary.uploader.destroy).toHaveBeenCalledTimes(3);
      for (const id of publicIds) {
        expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(id);
      }
    });

    it("should log error and continue if one delete fails", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const publicIds = ["img1", "img2"];

      (cloudinary.uploader.destroy as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce({})
        .mockRejectedValueOnce(new Error("Cloudinary error"));

      await remover.deleteFilesByPublicIds(publicIds);

      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith("img1");
      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith("img2");
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to delete Cloudinary image: img2",
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe("deleteFolder", () => {
    it("should call delete_folder with correct path", async () => {
      (
        cloudinary.api.delete_folder as ReturnType<typeof vi.fn>
      ).mockResolvedValue({});

      await remover.deleteFolder("my-folder");

      expect(cloudinary.api.delete_folder).toHaveBeenCalledWith("my-folder");
    });

    it("should log warning if delete_folder fails", async () => {
      const consoleWarnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {});
      (
        cloudinary.api.delete_folder as ReturnType<typeof vi.fn>
      ).mockRejectedValue(new Error("Failed to delete folder"));

      await remover.deleteFolder("broken-folder");

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Could not delete folder broken-folder:",
        "Failed to delete folder"
      );

      consoleWarnSpy.mockRestore();
    });
  });
});
