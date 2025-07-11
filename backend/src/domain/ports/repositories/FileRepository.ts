import { UserFile } from "../../entities/UserFile.js";

export interface FileRepository {
  /**
   * Save a file entity to the database
   * @param file - The file to be saved
  */
  save(file: UserFile): Promise<void>;
  /**
   * Retrieves all files associated with a specific section ID
   * @param sectionId - The section ID to filter files by
   * @returns A list of files belonging to the section
  */
  findBySectionId(sectionId: number): Promise<UserFile[]>;
  /**
   * Deletes files from the database using its Cloudinary public ID
   * @param publicId - The unique identifier of the file in Cloudinary
  */
  deleteFilesByPublicIds(publicIds: string[]): Promise<void>;
}
