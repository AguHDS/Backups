import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { login, register, refreshToken, logout } from "../api/authApi";
import { clearAuth } from "@/app/redux/features/slices/authSlice";
import type { RootState } from "@/app/redux/store";
import type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RegisterResponse,
  RefreshTokenResponse,
  LogoutResponse,
} from "../api/authTypes";

export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: login,
  });
};

export const useRegister = () => {
  return useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationFn: register,
  });
};

export const useRefreshToken = () => {
  return useMutation<RefreshTokenResponse, Error, void>({
    mutationFn: refreshToken,
  });
};

export const useLogout = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.auth.userData.id);

  return useMutation<LogoutResponse, Error, void>({
    mutationFn: () => {
      if (!userId) {
        throw new Error("User ID not found");
      }
      return logout({ id: userId });
    },
    onSuccess: () => {
      dispatch(clearAuth());
    },
  });
};

export type { LoginResponse, RegisterResponse, RefreshTokenResponse, LogoutResponse };
