interface ProfileContent {
  bio: string;
  profile_pic?: string;
  partner?: string;
  friends: number;
}

export interface ProfileSection {
  title: string;
  description: string;
}

export interface CustomResponse {
  name: string;
  role: string;
  id: number;
  email: string;
  userProfileData: ProfileContent;
  userSectionData: ProfileSection[];
}