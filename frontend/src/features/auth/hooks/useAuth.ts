import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../../../shared";
import { useDispatch } from "react-redux";
import { login } from "../../../app/redux/features/authSlice";
import { UserDataWithToken } from "../../../types";
import { getFormData, validateLoginFields } from "../helpers";

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

  // Local frontend validation
  const errorCheck = (): boolean => {
    const warnings = validateLoginFields(input.user, input.password, input.email);
    setInput((prev) => ({ ...prev, inputsWarnings: warnings }));
    return warnings.length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!errorCheck()) return;

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

    if ("message" in data && data.message === "Registration completed") {
      navigate("/");
      return;
    }

    if ("accessToken" in data && "userData" in data) {
      await dispatch(login(data)); //cada vez que se hace f5 se reinicia el refresh y deberia hacero solo cuando se renueva el access token
      navigate("/dashboard");
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
