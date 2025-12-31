export class UserFile {
  constructor(
    public readonly publicId: string,
    public readonly url: string,
    public readonly sectionId: number,
    public readonly sizeInBytes: number,
    public readonly userId: number | string
  ) {
    if (
      !publicId ||
      !url ||
      !sectionId ||
      sizeInBytes == null ||
      userId == null
    )
      throw new Error("Invalid file data");
  }
}
