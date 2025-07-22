import { UserFile } from "../../entities/UserFile.js";

export interface FileRepository {
  /**
   * Save a file entity to the database
   * @param file - The file to be saved
   */
  save(file: UserFile): Promise<void>;

  /** Save files in one request to db
   * @param files - An array of UserFile entities to be saved
   * @returns A promise that resolves when all files are saved
   */
  saveMany(files: UserFile[]): Promise<void>;

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
  deleteFilesByPublicIds(publicIds: string[]): Promise<UserFile[]>;
}
