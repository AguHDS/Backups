import { axiosClient } from "@/lib/http";
import type {
  GetProfileResponse,
  GetStorageResponse,
  UpdateBioAndSectionsRequest,
  UpdateBioAndSectionsResponse,
  DeleteSectionsRequest,
  DeleteSectionsResponse,
  DeleteFilesRequest,
  DeleteFilesResponse,
  UploadFilesResponse,
  UploadProfilePictureResponse,
} from "./profileTypes";

const API_BASE = "/api";

export const getProfile = async (
  username: string
): Promise<GetProfileResponse> => {
  const response = await axiosClient.get<GetProfileResponse>(
    `${API_BASE}/getProfile/${username}`,
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
    `${API_BASE}/getStorage/${username}`
  );

  return response.data;
};

export const updateBioAndSections = async (
  username: string,
  data: UpdateBioAndSectionsRequest
): Promise<UpdateBioAndSectionsResponse> => {
  const response = await axiosClient.post<UpdateBioAndSectionsResponse>(
    `${API_BASE}/updateBioAndSections/${username}`,
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
    `${API_BASE}/deleteSections/${username}`,
    {
      data,
      withCredentials: true,
    }
  );

  return response.data;
};

export const deleteFiles = async (
  username: string,
  data: DeleteFilesRequest
): Promise<DeleteFilesResponse> => {
  const response = await axiosClient.delete<DeleteFilesResponse>(
    `${API_BASE}/deleteFiles/${username}`,
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
    `${API_BASE}/uploadFiles/${username}?sectionId=${sectionId}&sectionTitle=${sectionTitle}`,
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
    `${API_BASE}/profilePicture/${username}`,
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
