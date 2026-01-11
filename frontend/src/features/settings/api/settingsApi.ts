import { axiosClient } from "@/lib/http";
import type {
  UpdateCredentialsRequest,
  UpdateCredentialsResponse,
} from "./settingsTypes";

export const updateCredentials = async (
  data: UpdateCredentialsRequest
): Promise<UpdateCredentialsResponse> => {
  const response = await axiosClient.put<UpdateCredentialsResponse>(
    "/api/changeCredentials",
    data
  );

  return response.data;
};

// Helper para manejar errores específicos de settings
export const getSettingsErrorMessage = (error: any): string => {
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }
  if (error?.message) {
    return error.message;
  }
  return "An error occurred while updating settings";
};

// Helper para obtener el campo específico con error
export const getSettingsErrorField = (error: any): string | undefined => {
  return error?.response?.data?.field;
};
