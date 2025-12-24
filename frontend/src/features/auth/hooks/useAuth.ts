import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useFetch } from "@/shared";
import { useDispatch } from "react-redux";
import { login } from "@/app/redux/features/slices/authSlice";
import type { UserDataWithToken } from "@/shared/types";
import { getFormData } from "../helpers";

type AuthResponse = UserDataWithToken | { message: string };

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
  const { data, status, error, fetchData } = useFetch<AuthResponse>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setStatusMessage(null);

    const formData = getFormData(e.currentTarget);
    const isRegistering = "email" in formData;

    const endpoint = isRegistering
      ? `http://localhost:${import.meta.env.VITE_BACKENDPORT}/api/registration`
      : `http://localhost:${import.meta.env.VITE_BACKENDPORT}/api/login`;

    fetchData(endpoint, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
  };

  useEffect(() => {
    const handleAuth = async () => {
      if (data === null || status === null) return;

      setStatusMessage(error);

      // When registration is successful
      if ("message" in data && data.message === "Registration completed") {
        navigate({ to: "/sign-in" });
        return;
      }

      // When login is successful
      if ("accessToken" in data && "userData" in data) {
        await dispatch(login(data));
        navigate({ to: "/dashboard", replace: true });
      }
    };

    handleAuth();
  }, [data, status, error, navigate, dispatch]);

  return {
    input,
    setInput,
    status,
    statusMessage,
    handleSubmit,
  };
};
