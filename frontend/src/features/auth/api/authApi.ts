import { axiosClient } from "@/lib/http";
import type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RegisterResponse,
  LogoutResponse,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
  RequestPasswordResetResponse,
  ResetPasswordResponse,
} from "./authTypes";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await axiosClient.post<LoginResponse>(
    "/api/auth/login",
    data
  );

  return response.data;
};

export const register = async (
  data: RegisterRequest
): Promise<RegisterResponse> => {
  const response = await axiosClient.post<RegisterResponse>(
    "/api/auth/register",
    data
  );

  return response.data;
};

export const logout = async (): Promise<LogoutResponse> => {
  const response = await axiosClient.post<LogoutResponse>(
    "/api/auth/sign-out",
    {}
  );

  return response.data;
};

export const requestPasswordReset = async (
  data: RequestPasswordResetRequest
): Promise<RequestPasswordResetResponse> => {
  const response = await axiosClient.post<RequestPasswordResetResponse>(
    "/api/auth/request-password-reset",
    {
      email: data.email,
      redirectTo: `${window.location.origin}/reset-password`,
    }
  );

  return response.data;
};

export const resetPassword = async (
  data: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
  const response = await axiosClient.post<ResetPasswordResponse>(
    "/api/auth/reset-password", 
    {
      newPassword: data.password,
      token: data.token,
    }
  );

  return response.data;
};