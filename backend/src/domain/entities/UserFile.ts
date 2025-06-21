export class UserFile {
  constructor(
    public readonly publicId: string,
    public readonly url: string,
    public readonly sectionId: string //fk for id in users_profile_Sections table (we get sectionId from url params)
  ) {
    if (!publicId || !url || !sectionId) throw new Error("Invalid file data");
  }
}
