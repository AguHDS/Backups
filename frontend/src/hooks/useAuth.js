import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

//custom hooks
import useFetch from "./useFetch";

//helpers
import {
  getFormData,
  validateLoginFields,
  validateLoginStatus,
} from "../helpers";

//redux
import { useDispatch } from "react-redux";
import { login } from "../redux/features/authSlice"; //almacenar el .user al estado global de redux

/**
 * Validator and error handler for login and sign up
 */

export default function useAuth() {
  const [input, setInput] = useState({
    user: "",
    password: "",
    email: "",
    inputsWarnings: [],
  });

  const [statusMessage, setStatusMessage] = useState(null);
  const { data, status, fetchData } = useFetch();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //frontent validation
  const errorCheck = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();

    //if there is not input errors, do fetch
    if (errorCheck()) {
      const formData = getFormData(e.target);

      let endpoint = "";

      "email" in formData
        ? (endpoint = `${import.meta.env.VITE_BACKEND}/registration`)
        : (endpoint = `${import.meta.env.VITE_BACKEND}/login`);

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

    console.log("entrando en el useEffect");
    const { message, redirect } = validateLoginStatus(status);
    setStatusMessage(message);

    //if user registers, redirect without login
    if (data.email) {
      navigate("/");
      return;
    }

    //if user logs in, setup redux global state and redirect
    dispatch(login(data));
    if (redirect) navigate("/home");
  }, [data, status, navigate]);

  return {
    input,
    setInput,
    status,
    statusMessage,
    handleSubmit,
  };
}
