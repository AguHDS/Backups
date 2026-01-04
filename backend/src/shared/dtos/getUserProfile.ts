interface ProfileContent {
  bio: string;
  profile_pic?: string;
  level: number;
}

export interface UploadedFile {
  publicId: string;
  sectionId: string;
  sizeInBytes: number;
  userId: number | string;
}

export interface ProfileSection {
  id: number;
  title: string;
  description?: string;
  isPublic: boolean;
  files?: UploadedFile[];
}

export interface GetProfileResponse {
  username: string;
  role: "user" | "admin"
  id: number | string;
  email: string;
  isOwner: boolean;
  isAdmin: boolean;
  userProfileData: ProfileContent;
  userSectionData: ProfileSection[];
}