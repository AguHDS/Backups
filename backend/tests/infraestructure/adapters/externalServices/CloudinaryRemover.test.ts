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
      sub_folders: vi.fn(),
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

  describe("deleteFoldersBySectionId", () => {
    it("should delete all folders matching section ID", async () => {
      const username = "john";
      const userId = 42;
      const sectionId = 1;

      const mockFolders = {
        folders: [
          { name: "section: Old Title (id: 1)" },
          { name: "section: New Title (id: 1)" },
          { name: "section: Other (id: 2)" },
        ],
      };

      (
        cloudinary.api.sub_folders as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockFolders);
      (
        cloudinary.api.delete_folder as ReturnType<typeof vi.fn>
      ).mockResolvedValue({});

      await remover.deleteFoldersBySectionId(username, userId, sectionId);

      expect(cloudinary.api.sub_folders).toHaveBeenCalledWith(
        "user_files/john (id: 42)"
      );
      expect(cloudinary.api.delete_folder).toHaveBeenCalledTimes(2);
      expect(cloudinary.api.delete_folder).toHaveBeenCalledWith(
        "user_files/john (id: 42)/section: Old Title (id: 1)"
      );
      expect(cloudinary.api.delete_folder).toHaveBeenCalledWith(
        "user_files/john (id: 42)/section: New Title (id: 1)"
      );
    });

    it("should handle errors gracefully", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      (
        cloudinary.api.sub_folders as ReturnType<typeof vi.fn>
      ).mockRejectedValue(new Error("API error"));

      await expect(
        remover.deleteFoldersBySectionId("john", 42, 1)
      ).rejects.toThrow();

      consoleErrorSpy.mockRestore();
    });
  });
});
