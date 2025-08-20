interface ProfileContent {
  bio: string;
  profile_pic?: string;
  partner: string;
  level: number;
}

export interface ProfileSection {
  id: number;
  title: string;
  description: string;
  isPublic: boolean;
}

export interface GetProfileResponse {
  username: string;
  role: "user" | "admin"
  id: number | string;
  email: string;
  isOwner: boolean;
  userProfileData: ProfileContent;
  userSectionData: ProfileSection[];
}