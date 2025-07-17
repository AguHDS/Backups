import { SectionWithFile, BaseSection } from "./section";

export interface ProfileStats {
  bio: string;
  profile_pic?: string;
  partner: string;
  friends: number;
}

// profile data without files
export interface UserProfileBasic {
  username: string;
  role: string;
  id: number;
  isOwner: boolean;
  userProfileData: ProfileStats;
  userSectionData: BaseSection[];
}

// profile data with files
export interface UserProfileWithFiles extends UserProfileBasic {
  userSectionData: SectionWithFile[];
}

// structure needed when using useFetch hook
export interface FetchedUserProfile {
  data: UserProfileWithFiles;
}
