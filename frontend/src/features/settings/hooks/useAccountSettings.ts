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

/**
 * Hook to manage account setup form.
 * Handles validation, status and submission of credential changes.
 */
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
  const [systemErrors, setSystemErrors] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const updateCredentialsMutation = useUpdateCredentials();
  const { mutateAsync: logout } = useLogout();

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    const warnings: string[] = [];
    let isValid = true;

    const { username, email, newPassword, confirmPassword, currentPassword } =
      formData;

    const hasFieldChanges =
      username.trim() !== "" ||
      email.trim() !== "" ||
      newPassword.trim() !== "";

    if (!hasFieldChanges) {
      warnings.push("You must change at least one field");
      isValid = false;
    }

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

    if (email.trim() !== "") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        errors.email = "Please enter a valid email address";
        isValid = false;
      }
    }

    if (newPassword.trim() !== "") {
      if (newPassword !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
        isValid = false;
      }
    }

    if (hasFieldChanges && !currentPassword.trim()) {
      errors.currentPassword =
        "Current password is required to confirm changes";
      isValid = false;
    }

    if (currentPassword.trim() && currentPassword.trim().length < 1) {
      errors.currentPassword = "Please enter your current password";
      isValid = false;
    }

    setValidationErrors(errors);
    setSystemErrors(warnings);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    if (statusMessage || systemErrors.length > 0) {
      setStatusMessage(null);
      setStatusCode(null);
      setSystemErrors([]);
    }

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

  const handleOkButtonClick = async (): Promise<void> => {
    try {
      setShowSuccessModal(false);
      await logout();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setStatusMessage(null);
    setStatusCode(null);
    setSystemErrors([]);
    setValidationErrors({});

    if (!validateForm()) {
      return;
    }

    try {
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

      if (formData.currentPassword.trim() !== "") {
        updateData.currentPassword = formData.currentPassword;
      }

      const result = await updateCredentialsMutation.mutateAsync(updateData);

      if (result.success) {
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

        setSuccessMessage(
          `${changeMessage} Please sign in again with your new credentials.`
        );
        setShowSuccessModal(true);

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

      const errorMessages = processErrorMessages(error);

      const validationErrorMessages = [
        "Username must be between 3 and 30 characters",
        "Username can only contain letters, numbers and underscores",
        "Please enter a valid email address",
        "Passwords do not match",
        "Current password is required to confirm changes",
        "Please enter your current password",
        "Current password is incorrect",
        "Username is already taken",
        "Email is already in use",
        "You must change at least one field",
        "You can only change your username once every 15 days",
      ];

      const newValidationErrors: ValidationErrors = {};
      const newSystemErrors: string[] = [];

      errorMessages.forEach((msg) => {
        if (
          validationErrorMessages.some((validationMsg) =>
            msg
              .toLowerCase()
              .includes(
                validationMsg
                  .toLowerCase()
                  .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
              )
          )
        ) {
          if (msg.toLowerCase().includes("username")) {
            if (msg.toLowerCase().includes("taken")) {
              newValidationErrors.username = msg;
            } else if (msg.toLowerCase().includes("only change")) {
              newValidationErrors.username = msg;
            } else if (msg.toLowerCase().includes("between")) {
              newValidationErrors.username = msg;
            } else if (msg.toLowerCase().includes("letters")) {
              newValidationErrors.username = msg;
            }
          } else if (msg.toLowerCase().includes("email")) {
            if (
              msg.toLowerCase().includes("taken") ||
              msg.toLowerCase().includes("in use")
            ) {
              newValidationErrors.email = msg;
            } else if (msg.toLowerCase().includes("valid")) {
              newValidationErrors.email = msg;
            }
          } else if (
            msg.toLowerCase().includes("password") &&
            msg.toLowerCase().includes("incorrect")
          ) {
            newValidationErrors.currentPassword = msg;
          } else if (msg.toLowerCase().includes("passwords do not match")) {
            newValidationErrors.confirmPassword = msg;
          } else if (msg.toLowerCase().includes("current password")) {
            if (!newValidationErrors.currentPassword) {
              newValidationErrors.currentPassword = msg;
            }
          } else {
            newSystemErrors.push(msg);
          }
        } else {
          newSystemErrors.push(msg);
        }
      });

      setValidationErrors(newValidationErrors);
      setSystemErrors(newSystemErrors);

      if (error?.response?.data?.field) {
        const { field, error: fieldError } = error.response.data;
        setValidationErrors((prev) => ({
          ...prev,
          [field]: fieldError,
        }));
      }

      if (error?.response?.status) {
        setStatusCode(error.response.status);
      } else {
        setStatusCode(500);
      }
    }
  };

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
    setSystemErrors([]);
    setHasChanges(false);
    setShowSuccessModal(false);
  };

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
    systemErrors,
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
