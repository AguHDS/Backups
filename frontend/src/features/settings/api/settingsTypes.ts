export interface UpdateCredentialsRequest {
  username?: string;
  email?: string;
  newPassword?: string;
  currentPassword?: string;
}

export interface UpdateCredentialsResponse {
  success: boolean;
  message: string;
  updatedFields?: {
    username?: string;
    email?: string;
    password?: boolean;
  };
}

export interface SettingsErrorResponse {
  success: boolean;
  error: string;
  field?: string;
  code?: string;
}
