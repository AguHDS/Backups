import { UserFile } from "./UserFile.js";

export class UserProfileSection {
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public files?: UserFile[],
    public isPublic?: boolean
  ) {}
}
