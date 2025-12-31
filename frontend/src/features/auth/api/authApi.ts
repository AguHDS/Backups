import { axiosClient } from "@/lib/http";
import type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RegisterResponse,
  LogoutResponse,
} from "./authTypes";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await axiosClient.post<LoginResponse>("/api/auth/login", data);

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
