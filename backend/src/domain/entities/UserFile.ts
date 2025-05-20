export class UserFile {
  constructor(
    public readonly publicId: string,
    public readonly url: string,
    public readonly sectionId: number //fk to users_profile_Sections table
  ) {
    if (!publicId || !url || !sectionId) {
      throw new Error("Invalid file data");
    }
  }
}
