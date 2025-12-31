import { axiosClient } from "@/lib/http";
import type {
  UpdateUserCredentialsRequest,
  UpdateUserCredentialsResponse,
  DeleteUserSectionsRequest,
  DeleteUserSectionsResponse,
  DeleteUserRequest,
  DeleteUserResponse,
  GetAllUsersResponse,
  GetUserSectionsResponse,
} from "./adminTypes";

export const getAllUsers = async (): Promise<GetAllUsersResponse> => {
  const response = await axiosClient.get<GetAllUsersResponse>(
    "/api/admin/users"
  );
  return response.data;
};

export const getUserSections = async (
  userId: string
): Promise<GetUserSectionsResponse> => {
  const response = await axiosClient.get<GetUserSectionsResponse>(
    `/api/admin/users/${userId}/sections`
  );
  return response.data;
};

export const updateUserCredentials = async (
  data: UpdateUserCredentialsRequest
): Promise<UpdateUserCredentialsResponse> => {
  const response = await axiosClient.patch<UpdateUserCredentialsResponse>(
    "/api/admin/updateUserCredentials",
    data
  );
  return response.data;
};

export const deleteUserSections = async (
  data: DeleteUserSectionsRequest
): Promise<DeleteUserSectionsResponse> => {
  const response = await axiosClient.delete<DeleteUserSectionsResponse>(
    "/api/admin/deleteUserSections",
    { data }
  );
  return response.data;
};

export const deleteUser = async (
  data: DeleteUserRequest
): Promise<DeleteUserResponse> => {
  const response = await axiosClient.delete<DeleteUserResponse>(
    "/api/admin/deleteUser",
    { data }
  );
  return response.data;
};
