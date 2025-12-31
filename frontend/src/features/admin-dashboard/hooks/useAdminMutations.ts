import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllUsers,
  getUserSections,
  updateUserCredentials,
  deleteUserSections,
  deleteUser,
} from "../api/adminApi";
import type {
  UpdateUserCredentialsRequest,
  DeleteUserSectionsRequest,
  DeleteUserRequest,
} from "../api/adminTypes";

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: getAllUsers,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetUserSections = (userId: string | null) => {
  return useQuery({
    queryKey: ["admin", "users", userId, "sections"],
    queryFn: () => getUserSections(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateUserCredentials = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserCredentialsRequest) =>
      updateUserCredentials(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
};

export const useDeleteUserSections = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeleteUserSectionsRequest) => deleteUserSections(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "users", variables.userId, "sections"],
      });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeleteUserRequest) => deleteUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
};
