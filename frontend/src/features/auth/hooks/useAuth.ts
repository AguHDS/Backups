import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useDispatch } from "react-redux";
import { login } from "@/app/redux/features/slices/authSlice";
import { getFormData } from "../helpers";
import { useLogin, useRegister } from "./useAuthMutations";
import type {
  LoginRequest,
  RegisterRequest,
  LoginPayload,
} from "../api/authTypes";

interface AuthInput {
  user: string;
  password: string;
  email: string;
  inputsWarnings: string[];
}

/**
 * Custom hook for login and registration handling
 */
export const useAuth = () => {
  const [input, setInput] = useState<AuthInput>({
    user: "",
    password: "",
    email: "",
    inputsWarnings: [],
  });

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage(null);

    const formData = getFormData(e.currentTarget);
    const isRegistering = "email" in formData;

    try {
      if (isRegistering) {
        const result = await registerMutation.mutateAsync(
          formData as RegisterRequest
        );

        if (result.message === "Registration completed") {
          navigate({ to: "/sign-in" });
        } else {
          setStatusMessage("Unexpected registration response");
        }
      } else {
        const result = await loginMutation.mutateAsync(
          formData as LoginRequest
        );

        // LoginPayload for redux
        const loginPayload: LoginPayload = {
          accessToken: result.accessToken,
          userData: result.userData,
          refreshTokenRotated: false,
        };

        await dispatch(login(loginPayload));
        navigate({ to: "/dashboard", replace: true });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Authentication failed";

      setStatusMessage(errorMessage);

      // Log for debugging
      if (import.meta.env.VITE_QUERY_ENV === "development") {
        console.error("DEBUG: Auth error:", error);
      }
    }
  };

  return {
    input,
    setInput,
    statusMessage,
    handleSubmit,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    isError: loginMutation.isError || registerMutation.isError,
    error: loginMutation.error || registerMutation.error,
    status:
      loginMutation.isPending || registerMutation.isPending
        ? "loading"
        : loginMutation.isError || registerMutation.isError
          ? "error"
          : "idle",
  };
};
