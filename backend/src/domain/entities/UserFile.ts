export class UserFile {
  constructor(
    public readonly publicId: string,
    public readonly sectionId: number,
    public readonly sizeInBytes: number,
    public readonly userId: number
  ) {
    if (
      !publicId ||
      !sectionId ||
      sizeInBytes == null ||
      userId == null
    )
      throw new Error("Invalid file data");
  }
}
