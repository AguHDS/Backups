import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateBioAndSections,
  deleteSections,
  deleteFiles,
  uploadFiles,
  uploadProfilePicture,
} from "../api/profileApi";
import type {
  UpdateBioAndSectionsRequest,
  UpdateBioAndSectionsResponse,
  DeleteSectionsRequest,
  DeleteSectionsResponse,
  DeleteFilesRequest,
  DeleteFilesResponse,
  UploadFilesResponse,
  UploadProfilePictureResponse,
} from "../api/profileTypes";

interface UpdateBioAndSectionsMutationVariables {
  username: string;
  data: UpdateBioAndSectionsRequest;
}

interface DeleteSectionsMutationVariables {
  username: string;
  data: DeleteSectionsRequest;
}

interface DeleteFilesMutationVariables {
  username: string;
  data: DeleteFilesRequest;
}

interface UploadFilesMutationVariables {
  username: string;
  sectionId: number;
  sectionTitle: string;
  formData: FormData;
}

interface UploadProfilePictureMutationVariables {
  username: string;
  formData: FormData;
}

export const useUpdateBioAndSections = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateBioAndSectionsResponse,
    Error,
    UpdateBioAndSectionsMutationVariables
  >({
    mutationFn: ({ username, data }) => updateBioAndSections(username, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["profile", variables.username],
      });
    },
  });
};

export const useDeleteSections = () => {
  const queryClient = useQueryClient();

  return useMutation<
    DeleteSectionsResponse,
    Error,
    DeleteSectionsMutationVariables
  >({
    mutationFn: ({ username, data }) => deleteSections(username, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["profile", variables.username],
      });
      queryClient.invalidateQueries({
        queryKey: ["storage", variables.username],
      });
    },
  });
};

export const useDeleteFiles = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteFilesResponse, Error, DeleteFilesMutationVariables>(
    {
      mutationFn: ({ username, data }) => deleteFiles(username, data),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: ["profile", variables.username],
        });
        queryClient.invalidateQueries({
          queryKey: ["storage", variables.username],
        });
      },
    }
  );
};

export const useUploadFiles = () => {
  const queryClient = useQueryClient();

  return useMutation<UploadFilesResponse, Error, UploadFilesMutationVariables>(
    {
      mutationFn: ({ username, sectionId, sectionTitle, formData }) =>
        uploadFiles(username, sectionId, sectionTitle, formData),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: ["profile", variables.username],
        });
        queryClient.invalidateQueries({
          queryKey: ["storage", variables.username],
        });
      },
    }
  );
};

export const useUploadProfilePicture = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UploadProfilePictureResponse,
    Error,
    UploadProfilePictureMutationVariables
  >({
    mutationFn: ({ username, formData }) =>
      uploadProfilePicture(username, formData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["profile", variables.username],
      });
    },
  });
};
