import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../../../shared";
import { useDispatch } from "react-redux";
import { login } from "../../../app/redux/features/authSlice";
import { UserDataWithToken } from "../../../types";
import {
  getFormData,
  validateLoginFields,
  validateLoginStatus,
} from "../helpers";

type AuthResponse = UserDataWithToken | { message: string };

interface AuthInput  {
  user: string;
  password: string;
  email: string;
  inputsWarnings: string[];
}

/**
 * Validator for login and registration
*/

export const useAuth = () => {
  const [input, setInput] = useState<AuthInput>({
    user: "",
    password: "",
    email: "",
    inputsWarnings: [],
  });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const { data, status, fetchData } = useFetch<AuthResponse>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //frontend input validation
  const errorCheck = (): boolean => {
    const warnings = validateLoginFields(
      input.user,
      input.password,
      input.email
    );
    setInput((prev) => ({
      ...prev,
      inputsWarnings: [...warnings],
    }));

    return warnings.length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //if there is not input errors, consume /registration or /login
    if (errorCheck()) {
      const formData = getFormData(e.currentTarget);

      let endpoint = "";
      if ("email" in formData) {
        endpoint = `http://localhost:${import.meta.env.VITE_BACKENDPORT}/api/registration`;
      } else {
        endpoint = `http://localhost:${import.meta.env.VITE_BACKENDPORT}/api/login`;
      }

      fetchData(endpoint, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    }
  };

  useEffect(() => {
    if (data === null || status === null) return;

    const { message, redirect } = validateLoginStatus(status);
    setStatusMessage(message);

    //if user registers, redirect without login
    if ("message" in data && data.message === "Registration completed") {
      navigate("/");
      window.location.reload();
      return;
    }

    //if user logs in, setup redux global state and redirect
    dispatch(login(data));
    if (redirect) {
      navigate("/dashboard");
      window.location.reload();
    }
  }, [data, status, navigate, dispatch]);

  return {
    input,
    setInput,
    status,
    statusMessage,
    handleSubmit,
  };
}