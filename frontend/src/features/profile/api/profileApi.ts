import { axiosClient } from "@/lib/http";
import type {
  GetProfileResponse,
  GetStorageResponse,
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
} from "./profileTypes";

export const getProfile = async (
  username: string
): Promise<GetProfileResponse> => {
  const response = await axiosClient.get<GetProfileResponse>(
    `/api/getProfile/${username}`,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const getStorage = async (
  username: string
): Promise<GetStorageResponse> => {
  const response = await axiosClient.get<GetStorageResponse>(
    `/api/getStorage/${username}`
  );

  return response.data;
};

export const updateBio = async (
  username: string,
  data: UpdateBioRequest
): Promise<UpdateBioResponse> => {
  const response = await axiosClient.post<UpdateBioResponse>(
    `/api/updateBio/${username}`,
    data,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const updateSections = async (
  username: string,
  data: UpdateSectionsRequest
): Promise<UpdateSectionsResponse> => {
  const response = await axiosClient.post<UpdateSectionsResponse>(
    `/api/updateSections/${username}`,
    data,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const deleteSections = async (
  username: string,
  data: DeleteSectionsRequest
): Promise<DeleteSectionsResponse> => {
  const response = await axiosClient.delete<DeleteSectionsResponse>(
    `/api/deleteSections/${username}`,
    {
      data,
      withCredentials: true,
    }
  );

  return response.data;
};

export const deleteFiles = async (
  username: string,
  data: DeleteFilesRequest[]
): Promise<DeleteFilesResponse> => {
  const response = await axiosClient.delete<DeleteFilesResponse>(
    `/api/deleteFiles/${username}`,
    {
      data,
      withCredentials: true,
    }
  );

  return response.data;
};

export const uploadFiles = async (
  username: string,
  sectionId: number,
  sectionTitle: string,
  formData: FormData
): Promise<UploadFilesResponse> => {
  const response = await axiosClient.post<UploadFilesResponse>(
    `/api/uploadFiles/${username}?sectionId=${sectionId}&sectionTitle=${sectionTitle}`,
    formData,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const uploadProfilePicture = async (
  username: string,
  formData: FormData
): Promise<UploadProfilePictureResponse> => {
  const response = await axiosClient.post<UploadProfilePictureResponse>(
    `/api/profilePicture/${username}`,
    formData,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
