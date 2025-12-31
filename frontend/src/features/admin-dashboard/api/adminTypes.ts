import type { UserData } from "@/shared/types";

// Re-export UserData as User for this feature
export type User = UserData;

export interface UserSection {
  id: number;
  title: string;
  description: string | null;
  isPublic: boolean;
}

// Request types
export interface UpdateUserCredentialsRequest {
  userId: string;
  username?: string;
  email?: string;
  password?: string;
}

export interface DeleteUserSectionsRequest {
  userId: string;
  sectionIds: number[];
}

export interface DeleteUserRequest {
  userId: string;
}

// Response types
export interface UpdateUserCredentialsResponse {
  success: boolean;
  message: string;
}

export interface DeleteUserSectionsResponse {
  message: string;
  deletedCount: number;
}

export interface DeleteUserResponse {
  message: string;
}

export interface GetAllUsersResponse {
  users: User[];
}

export interface GetUserSectionsResponse {
  sections: UserSection[];
}
