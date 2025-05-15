interface ProfileContent {
  bio: string;
  profile_pic?: string;
  partner?: string;
  friends: number;
}

interface ProfileSection {
  title: string;
  description: string;
}

export interface CustomResponse {
  username: string;
  role: string;
  id: number;
  userProfileData: ProfileContent;
  userSectionData: ProfileSection[];
}