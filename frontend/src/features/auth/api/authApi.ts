import { axiosClient } from "@/lib/http";
import type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RegisterResponse,
  RefreshTokenResponse,
  LogoutRequest,
  LogoutResponse,
} from "./authTypes";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await axiosClient.post<LoginResponse>("/api/login", data, {
    withCredentials: true,
  });

  return response.data;
};

export const register = async (
  data: RegisterRequest
): Promise<RegisterResponse> => {
  const response = await axiosClient.post<RegisterResponse>(
    "/api/registration",
    data,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const refreshToken = async (): Promise<RefreshTokenResponse> => {
  const response = await axiosClient.post<RefreshTokenResponse>(
    "/api/refreshToken",
    {},
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const logout = async (data: LogoutRequest): Promise<LogoutResponse> => {
  const response = await axiosClient.post<LogoutResponse>("/api/logout", data, {
    withCredentials: true,
  });

  return response.data;
};
