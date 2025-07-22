export class UserFile {
  constructor(
    public readonly publicId: string,
    public readonly url: string,
    public readonly sectionId: string, // FK to users_profile_sections
    public readonly sizeInBytes: number,
    public readonly userId: number | string// FK to users
  ) {
    if (!publicId || !url || !sectionId || sizeInBytes == null || userId == null) throw new Error("Invalid file data");
  }
}
