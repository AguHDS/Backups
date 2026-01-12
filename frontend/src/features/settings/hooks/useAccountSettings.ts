import { useState, type FormEvent } from "react";
import { useUpdateCredentials } from "./useSettingsMutations";
import { processErrorMessages } from "@/shared/utils/processErrorMessages";
import type { UpdateCredentialsRequest } from "../api/settingsTypes";
import { useLogout } from "@/features/auth/hooks/useAuthMutations";

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const updateCredentialsMutation = useUpdateCredentials();
  const { mutateAsync: logout } = useLogout();

  // Validaciones del frontend
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
      if (newPassword.length < 6) {
        errors.newPassword = "Password must be at least 6 characters";
        isValid = false;
      }
      if (newPassword !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
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

  // Manejar cambios en los inputs
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

  // Función para hacer logout cuando el usuario hace click en OK
  const handleOkButtonClick = async (): Promise<void> => {
    try {
      setShowSuccessModal(false);
      await logout();
    } catch (error) {
      console.error("Error during logout:", error);
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
        // Determinar qué cambió para mostrar el mensaje apropiado
        let changeMessage = "";
        const changedFields = [];

        if (formData.username.trim() !== "") changedFields.push("username");
        if (formData.email.trim() !== "") changedFields.push("email");
        if (formData.newPassword.trim() !== "") changedFields.push("password");

        if (changedFields.length === 1) {
          changeMessage = `Your ${changedFields[0]} has been updated successfully.`;
        } else if (changedFields.length > 1) {
          changeMessage = `Your ${changedFields.join(", ")} have been updated successfully.`;
        } else {
          changeMessage = "Settings updated successfully.";
        }

        // Mostrar modal con mensaje
        setSuccessMessage(
          `${changeMessage} Please sign in again with your new credentials.`
        );
        setShowSuccessModal(true);

        // Limpiar formulario
        setFormData({
          username: "",
          email: "",
          newPassword: "",
          confirmPassword: "",
          currentPassword: "",
        });
        setHasChanges(false);
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
        setStatusCode(500);
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
    setShowSuccessModal(false);
  };

  // Obtener todos los mensajes de error para ValidationMessages
  const getAllErrorMessages = (): string[] => {
    const errorMessages: string[] = [];

    Object.values(validationErrors).forEach((error) => {
      if (error) errorMessages.push(error);
    });

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
    isSubmitDisabled: isSubmitDisabled(),
    showSuccessModal,
    successMessage,
    handleInputChange,
    handleSubmit,
    handleCancel,
    handleOkButtonClick,
  };
};
