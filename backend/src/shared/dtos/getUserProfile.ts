interface ProfileContent {
  bio: string;
  profile_pic?: string;
  partner: string;
  friends: number;
}

export interface ProfileSection {
  id: number;
  title: string;
  description: string;
  isPublic: boolean;
}

export interface CustomResponse {
  username: string;
  role: string;
  id: number | string;
  email: string;
  isOwner: boolean;
  userProfileData: ProfileContent;
  userSectionData: ProfileSection[];
}