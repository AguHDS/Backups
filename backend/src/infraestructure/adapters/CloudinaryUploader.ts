import { FileUploader, FileData } from "../../domain/ports/FileUploader.js";
import { cloudinary } from "../../services/cloudinary.js";
import streamifier from "streamifier";

export class CloudinaryUploader implements FileUploader {
  async upload(files: Express.Multer.File[]): Promise<FileData[]> {
    const uploadPromises = files.map((file) => {
      return new Promise<FileData>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "Files_collection" },
          (error, result) => {
            if (error) return reject(error);
            resolve({ url: result.secure_url, public_id: result.public_id });
          }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
      });
    });

    return await Promise.all(uploadPromises);
  }
}
