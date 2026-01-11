import { useMutation } from "@tanstack/react-query";
import { updateCredentials } from "../api/settingsApi";
import type {
  UpdateCredentialsRequest,
  UpdateCredentialsResponse,
} from "../api/settingsTypes";

export const useUpdateCredentials = () => {
  return useMutation<
    UpdateCredentialsResponse,
    Error,
    UpdateCredentialsRequest
  >({
    mutationFn: updateCredentials,
  });
};
