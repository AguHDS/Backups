import { UserFile } from './UserFile.js';

export class UserProfileSection {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public title: string,
    public description: string,
    public files?: UserFile[]
  ) {}
}
