import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { login, register, logout } from "../api/authApi";
import { clearAuth } from "@/app/redux/features/slices/authSlice";
import type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RegisterResponse,
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

export const useLogout = () => {
  const dispatch = useDispatch();

  return useMutation<LogoutResponse, Error, void>({
    mutationFn: logout,
    onSuccess: () => {
      dispatch(clearAuth());
      window.location.href = "/";
    },
    onError: (error) => {
      console.error("Logout error:", error);
      dispatch(clearAuth());
      window.location.href = "/";
    },
  });
};

export type { LoginResponse, RegisterResponse, LogoutResponse };