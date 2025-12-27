import { axiosClient } from "@/lib/http";
import type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RegisterResponse,
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
