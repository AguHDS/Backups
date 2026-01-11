// frontend\src\features\settings\hooks\useAccountSettings.ts
import { useState, type FormEvent } from "react";
import { useUpdateCredentials } from "./useSettingsMutations";
import { processErrorMessages } from "@/shared/utils/processErrorMessages";
import type { UpdateCredentialsRequest } from "../api/settingsTypes";

interface AccountSettingsForm {
  username: string;
  email: string;
  newPassword: string;
  confirmPassword: string;
  currentPassword: string;
}

interface ValidationErrors {
  username?: string;
  email?: string;
  newPassword?: string;
  confirmPassword?: string;
  currentPassword?: string;
}

export const useAccountSettings = () => {
  const [formData, setFormData] = useState<AccountSettingsForm>({
    username: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
    currentPassword: "",
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [inputWarnings, setInputWarnings] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const updateCredentialsMutation = useUpdateCredentials();

  // Validaciones del frontend - MODIFICADA
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    const warnings: string[] = [];
    let isValid = true;

    const { username, email, newPassword, confirmPassword, currentPassword } =
      formData;

    // Verificar que al menos un campo tenga cambios (excepto currentPassword)
    const hasFieldChanges =
      username.trim() !== "" ||
      email.trim() !== "" ||
      newPassword.trim() !== "";

    if (!hasFieldChanges) {
      warnings.push("You must change at least one field");
      isValid = false;
    }

    // Validar username si se está cambiando
    if (username.trim() !== "") {
      if (username.length < 3 || username.length > 30) {
        errors.username = "Username must be between 3 and 30 characters";
        isValid = false;
      }
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        errors.username =
          "Username can only contain letters, numbers and underscores";
        isValid = false;
      }
    }

    // Validar email si se está cambiando
    if (email.trim() !== "") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = "Please enter a valid email address";
        isValid = false;
      }
    }

    // Validar nueva contraseña si se está cambiando
    if (newPassword.trim() !== "") {
      if (newPassword.length < 8) {
        errors.newPassword = "Password must be at least 8 characters";
        isValid = false;
      }
      if (newPassword !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match"; //hay que crear un endpoint para obtener los datos cambiados en el frontend
        isValid = false;
      }
    }

    // SIEMPRE se requiere currentPassword cuando hay cambios
    if (hasFieldChanges && !currentPassword.trim()) {
      errors.currentPassword =
        "Current password is required to confirm changes";
      isValid = false;
    }

    // Validar que la currentPassword tenga al menos 1 carácter si se proporciona
    if (currentPassword.trim() && currentPassword.trim().length < 1) {
      errors.currentPassword = "Please enter your current password";
      isValid = false;
    }

    setValidationErrors(errors);
    setInputWarnings(warnings);
    return isValid;
  };

  // Manejar cambios en los inputs - MEJORADO
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar errores específicos cuando el usuario empieza a escribir
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    // Limpiar mensajes generales
    if (statusMessage || inputWarnings.length > 0) {
      setStatusMessage(null);
      setStatusCode(null);
      setInputWarnings([]);
    }

    // Marcar que hay cambios si hay al menos un campo con valor (excepto currentPassword)
    if (!hasChanges) {
      const hasAnyFieldChanged =
        (name !== "currentPassword" && value.trim() !== "") ||
        (name === "currentPassword" &&
          value.trim() !== "" &&
          (formData.username.trim() !== "" ||
            formData.email.trim() !== "" ||
            formData.newPassword.trim() !== ""));

      if (hasAnyFieldChanged) {
        setHasChanges(true);
      }
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setStatusMessage(null);
    setStatusCode(null);
    setInputWarnings([]);
    setValidationErrors({});

    // Validar formulario
    if (!validateForm()) {
      return;
    }

    try {
      // Preparar datos para enviar al backend
      const updateData: UpdateCredentialsRequest = {};

      if (formData.username.trim() !== "") {
        updateData.username = formData.username.trim();
      }

      if (formData.email.trim() !== "") {
        updateData.email = formData.email.trim().toLowerCase();
      }

      if (formData.newPassword.trim() !== "") {
        updateData.newPassword = formData.newPassword;
      }

      // SIEMPRE enviar currentPassword si hay cambios
      if (formData.currentPassword.trim() !== "") {
        updateData.currentPassword = formData.currentPassword;
      }

      // Llamar a la API
      const result = await updateCredentialsMutation.mutateAsync(updateData);

      if (result.success) {
        setStatusMessage(result.message || "Settings updated successfully");
        setStatusCode(200);

        // Limpiar formulario después de éxito
        setFormData({
          username: "",
          email: "",
          newPassword: "",
          confirmPassword: "",
          currentPassword: "",
        });
        setHasChanges(false);

        // Limpiar mensaje después de 5 segundos
        setTimeout(() => {
          setStatusMessage(null);
          setStatusCode(null);
        }, 5000);
      }
    } catch (error: any) {
      console.error("Error updating settings:", error);

      // Procesar errores con processErrorMessages
      const errorMessages = processErrorMessages(error);
      setInputWarnings(errorMessages);

      // Establecer código de estado si está disponible
      if (error?.response?.status) {
        setStatusCode(error.response.status);
      } else {
        setStatusCode(500); // Error interno por defecto
      }

      // También mapear errores específicos por campo si el backend los proporciona
      if (error?.response?.data?.field) {
        const { field, error: fieldError } = error.response.data;
        setValidationErrors({
          [field]: fieldError,
        });
      }
    }
  };

  // Cancelar cambios
  const handleCancel = (): void => {
    setFormData({
      username: "",
      email: "",
      newPassword: "",
      confirmPassword: "",
      currentPassword: "",
    });
    setValidationErrors({});
    setStatusMessage(null);
    setStatusCode(null);
    setInputWarnings([]);
    setHasChanges(false);
  };

  // Obtener todos los mensajes de error para ValidationMessages
  const getAllErrorMessages = (): string[] => {
    const errorMessages: string[] = [];

    // Agregar errores de validación por campo
    Object.values(validationErrors).forEach((error) => {
      if (error) errorMessages.push(error);
    });

    // Agregar warnings del frontend
    errorMessages.push(...inputWarnings);

    return errorMessages;
  };

  // Función para verificar si el botón debe estar deshabilitado
  const isSubmitDisabled = (): boolean => {
    const isLoading = updateCredentialsMutation.isPending;
    if (isLoading) return true;

    const hasFieldChanges =
      formData.username.trim() !== "" ||
      formData.email.trim() !== "" ||
      formData.newPassword.trim() !== "";

    const hasCurrentPassword = formData.currentPassword.trim() !== "";

    return !hasFieldChanges || !hasCurrentPassword;
  };

  return {
    formData,
    validationErrors,
    statusMessage,
    statusCode,
    inputWarnings: getAllErrorMessages(),
    hasChanges,
    isLoading: updateCredentialsMutation.isPending,
    isSubmitDisabled: isSubmitDisabled(), // Llamar a la función
    handleInputChange,
    handleSubmit,
    handleCancel,
  };
};
