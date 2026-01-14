import { UserFile } from "../../entities/UserFile.js";

export interface FileRepository {
  /**
   * Save a file entity to the database
   * @param file - The file to be saved
   */
  save(file: UserFile): Promise<void>;

  /**
   * Save files in one request to db
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
   * Deletes files from the database using their Cloudinary public IDs
   * @param publicIds - The unique identifiers of the files in Cloudinary
   * @returns A promise that resolves to an array of deleted UserFile entities
   */
  deleteFilesByPublicIds(publicIds: string[]): Promise<UserFile[]>;

  /**
   * Retrieves files with their sizes associated with specific sections
   * @param sectionIds - An array of section IDs to retrieve files for
   * @returns A promise that resolves to an array of files with public ids and sizes
   */
  getFilesWithSizeBySectionId(
    sectionIds: number[]
  ): Promise<Pick<UserFile, "publicId" | "sizeInBytes">[]>;
}
