// Request
export interface LoginRequest {
  user: string;
  password: string;
}

export interface RegisterRequest {
  user: string;
  password: string;
  email: string;
}

export interface RequestPasswordResetRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

// Response
export interface UserData {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface LoginResponse {
  user: UserData;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface LogoutResponse {
  message: string;
}

export interface RequestPasswordResetResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

// Errors
export interface ValidationErrorResponse {
  message: string;
}

export type RegistrationConflictError =
  | { message: "Username already taken" }
  | { message: "Email already taken" }
  | { message: "Username and email are already taken" };

export interface ServerErrorResponse {
  message: string;
}

export type RegisterErrorResponse =
  | ValidationErrorResponse
  | RegistrationConflictError
  | ServerErrorResponse;

export type LoginErrorResponse = ValidationErrorResponse | ServerErrorResponse;
