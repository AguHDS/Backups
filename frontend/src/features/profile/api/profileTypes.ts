import type { UserProfileWithFiles } from "../types/profileData";
import type { BaseSection, UploadedFile } from "../types/section";

// Request types
export interface UpdateBioAndSectionsRequest {
  bio: string;
  sections: BaseSection[];
}

export interface DeleteSectionsRequest {
  sectionIds: number[];
}

export interface DeleteFilesRequest {
  filePublicIds: string[];
  sectionId: number;
}

// Response types
export type GetProfileResponse = UserProfileWithFiles;

export interface GetStorageResponse {
  used: number;
  limit: number;
  remaining: number;
}

export interface UpdateBioAndSectionsResponse {
  message: string;
  newlyCreatedSections?: Array<{
    tempId: number;
    newId: number;
  }>;
}

export interface DeleteSectionsResponse {
  message: string;
}

export interface DeleteFilesResponse {
  message: string;
}

export interface UploadFilesResponse {
  message: string;
  files: UploadedFile[];
}

export interface UploadProfilePictureResponse {
  message: string;
  data: {
    public_id: string;
  };
}
