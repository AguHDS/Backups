import { UserProfileSection } from './UserProfileSection.js';

export class UserProfile {
  constructor(
    public readonly userId: number,
    public bio: string,
    public level: number,
    public profilePic?: string,
    public partner?: string,
    public sections?: UserProfileSection[]
  ) {}
}
