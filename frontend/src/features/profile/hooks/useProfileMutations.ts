import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateBio,
  updateSections,
  deleteSections,
  deleteFiles,
  uploadFiles,
  uploadProfilePicture,
} from "../api/profileApi";
import type {
  UpdateBioRequest,
  UpdateBioResponse,
  UpdateSectionsRequest,
  UpdateSectionsResponse,
  DeleteSectionsRequest,
  DeleteSectionsResponse,
  DeleteFilesRequest,
  DeleteFilesResponse,
  UploadFilesResponse,
  UploadProfilePictureResponse,
} from "../api/profileTypes";

interface UpdateBioMutationVariables {
  username: string;
  data: UpdateBioRequest;
}

interface UpdateSectionsMutationVariables {
  username: string;
  data: UpdateSectionsRequest;
}

interface DeleteSectionsMutationVariables {
  username: string;
  data: DeleteSectionsRequest;
}

interface DeleteFilesMutationVariables {
  username: string;
  data: DeleteFilesRequest[];
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

export const useUpdateBio = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateBioResponse, Error, UpdateBioMutationVariables>({
    mutationFn: ({ username, data }) => updateBio(username, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["profile", variables.username],
      });
    },
  });
};

export const useUpdateSections = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateSectionsResponse,
    Error,
    UpdateSectionsMutationVariables
  >({
    mutationFn: ({ username, data }) => updateSections(username, data),
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
