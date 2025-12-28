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

// Response

export interface UserSessionData {
  name: string;
  email?: string;
  role: "user" | "admin";
  id: number;
}

export interface LoginResponse {
  accessToken: string;
  userData: UserSessionData;
}

export interface RegisterResponse {
  message: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  userData: UserSessionData;
}

export interface LogoutRequest {
  id: number;
}

export interface LogoutResponse {
  message: string;
}

// Redux dispatch payloads

export interface LoginPayload {
  accessToken: string;
  userData: UserSessionData;
  refreshTokenRotated?: boolean;
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

// Type Guards
export const isLoginResponse = (data: unknown): data is LoginResponse => {
  return (
    typeof data === "object" &&
    data !== null &&
    "accessToken" in data &&
    "userData" in data
  );
};

export const isRegisterResponse = (data: unknown): data is RegisterResponse => {
  return (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    (data as RegisterResponse).message === "Registration completed"
  );
};
