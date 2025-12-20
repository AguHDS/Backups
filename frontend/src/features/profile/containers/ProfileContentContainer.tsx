import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { useEditBio } from "../hooks/useEditBio";
import {
  useProfile,
  useSections,
  useFileDeletion,
  useStorageRefresh,
} from "../context";
import { useStorageData } from "../hooks/useStorageData";
import { useFetch } from "@/shared";
import {
  Header,
  ActionsAndProfileImg,
  UserInfo,
  StorageChart,
  ProfileRightContent,
} from "../components";
import { FetchedUserProfile } from "../types/profileData";
import { processErrorMessages } from "@/shared/utils/processErrorMessages";
import { ValidationMessages } from "@/shared";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import { getDashboardSummary } from "@/app/redux/features/thunks/dashboardThunk";

export const ProfileContentContainer = ({ data }: FetchedUserProfile) => {
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageRefreshKey, setImageRefreshKey] = useState<number>(0);
  const [profileImagePublicId, setProfileImagePublicId] = useState<string>(
    data.userProfileData.profile_pic || ""
  );
  const [profilePictureStatus, setProfilePictureStatus] = useState<
    number | null
  >(null);
  const [profilePictureErrors, setProfilePictureErrors] = useState<string[]>(
    []
  );

  const { isEditing, setIsEditing } = useProfile();

  const { flag: storageRefreshFlag, refresh: refreshStorage } =
    useStorageRefresh();
  const { usedBytes, limitBytes, remainingBytes } =
    useStorageData(storageRefreshFlag);
  const { filesToDelete, clearFilesToDelete } = useFileDeletion();
  const {
    fetchData,
    data: uploadResponse,
    status: uploadStatus,
    reset: resetFetch,
    error: uploadError,
  } = useFetch<{ data: { public_id: string } }>();
  const { username } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { updateData, setUpdateData } = useEditBio(data.userProfileData.bio);
  const { sections, sectionsToDelete, setSectionsToDelete, updateSectionIds } =
    useSections();
  const isInitialMount = useRef(true);

  // Preview image when selected
  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl(null);
      return;
    }

    const tempUrl = URL.createObjectURL(selectedImage);
    setPreviewUrl(tempUrl);

    return () => URL.revokeObjectURL(tempUrl);
  }, [selectedImage]);

  // Handle profile picture upload response
  useEffect(() => {
    if (uploadStatus === null) return;

    setProfilePictureStatus(uploadStatus);

    if (uploadStatus >= 200 && uploadStatus < 300) {
      if (uploadResponse?.data?.public_id) {
        setProfileImagePublicId(uploadResponse.data.public_id);
        setImageRefreshKey((prev) => prev + 1);
      }
      setProfilePictureErrors([]);
    } else if (uploadStatus >= 400) {
      const errorData = uploadResponse || uploadError;
      const messages = processErrorMessages(errorData);
      setProfilePictureErrors(messages);
    }
  }, [uploadStatus, uploadResponse, uploadError]);

  useEffect(() => {
    if (isEditing) {
      setErrorMessages([]);
      setProfilePictureErrors([]);
      setProfilePictureStatus(null);
      resetFetch();
    }
  }, [isEditing, resetFetch]);

  useEffect(() => {
    if (isInitialMount.current) {
      resetFetch();
      setProfilePictureStatus(null);
      isInitialMount.current = false;
    }
  }, [resetFetch]);

  const validateFields = useCallback(() => {
    const errors: string[] = [];
    if (!updateData.bio.trim()) errors.push("Bio cannot be empty");

    sections.forEach((section, index) => {
      if (!section.title.trim())
        errors.push(`Section ${index + 1} title is empty`);
      if (!section.description.trim())
        errors.push(`Section ${index + 1} description is empty`);
    });

    return errors;
  }, [updateData.bio, sections]);

  const handleUploadProfilePicture = useCallback(async (): Promise<boolean> => {
    if (!selectedImage) return true; // No hay imagen para subir, continuar

    const formData = new FormData();
    formData.append("profilePicture", selectedImage);

    await fetchData(
      `http://localhost:${
        import.meta.env.VITE_BACKENDPORT
      }/api/profilePicture/${username}`,
      {
        method: "POST",
        body: formData,
        credentials: "include",
      }
    );

    // Wait for the status to update
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Return true if upload was successful, false otherwise
    return (
      profilePictureStatus !== null &&
      profilePictureStatus >= 200 &&
      profilePictureStatus < 300
    );
  }, [selectedImage, fetchData, username, profilePictureStatus]);

  const handleSave = useCallback(async () => {
    const errors = validateFields();
    if (errors.length > 0) {
      setErrorMessages(errors);
      return;
    }

    try {
      let profilePictureSuccess = true;

      if (selectedImage) {
        profilePictureSuccess = await handleUploadProfilePicture();
        if (!profilePictureSuccess) {
          console.log("Profile picture upload failed, stopping save process");
          return;
        }
      }

      if (profilePictureSuccess) {
        if (sectionsToDelete.length > 0) {
          await fetch(
            `http://localhost:${
              import.meta.env.VITE_BACKENDPORT
            }/api/deleteSections/${username}`,
            {
              method: "DELETE",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sectionIds: sectionsToDelete }),
            }
          );
        }

        // Delete files if any
        if (filesToDelete.length > 0) {
          await fetch(
            `http://localhost:${
              import.meta.env.VITE_BACKENDPORT
            }/api/deleteFiles/${username}`,
            {
              method: "DELETE",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(filesToDelete),
            }
          );
        }

        // Update bio and sections
        const response = await fetch(
          `http://localhost:${
            import.meta.env.VITE_BACKENDPORT
          }/api/updateBioAndSections/${username}`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bio: updateData.bio,
              sections,
            }),
          }
        );

        const responseData = await response.json();
        if (responseData.newlyCreatedSections) {
          updateSectionIds(responseData.newlyCreatedSections);
        }

        setSectionsToDelete([]);
        clearFilesToDelete();
        setSelectedImage(null);
        setPreviewUrl(null);
        setErrorMessages([]);
        setProfilePictureErrors([]);
        setProfilePictureStatus(null);
        resetFetch();
        setIsEditing(false);

        refreshStorage();
        await dispatch(getDashboardSummary());
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setErrorMessages(processErrorMessages(error));
    }
  }, [
    validateFields,
    selectedImage,
    handleUploadProfilePicture,
    sections,
    sectionsToDelete,
    filesToDelete,
    updateData.bio,
    username,
    setSectionsToDelete,
    clearFilesToDelete,
    resetFetch,
    setIsEditing,
    refreshStorage,
    dispatch,
    updateSectionIds,
  ]);

  const handleCancel = useCallback(() => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setErrorMessages([]);
    setProfilePictureErrors([]);
    setProfilePictureStatus(null);
    resetFetch();
    setIsEditing(false);
  }, [resetFetch, setIsEditing]);

  const handleSelectImage = useCallback(
    (file: File) => {
      setSelectedImage(file);
      setProfilePictureErrors([]);
      setProfilePictureStatus(null);
      resetFetch();
    },
    [resetFetch]
  );

  return (
    <div className="mx-auto flex justify-center mt-5">
      <div className="w-[80vw] max-w-full">
        <Header
          username={data.username}
          onSave={handleSave}
          onCancel={handleCancel}
        />

        <div className="p-[8px] bg-[#121212] border-[#272727] border-r border-b">
          <div className="flex flex-col md:flex-row w-full">
            <div className="bg-[#272727] p-2 w-full md:w-[225px]">
              <ActionsAndProfileImg
                profilePic={profileImagePublicId}
                previewUrl={previewUrl}
                isEditing={isEditing}
                onSelectImage={handleSelectImage}
                refreshKey={imageRefreshKey}
              />

              {/* Display profile picture errors below the image */}
              {profilePictureErrors.length > 0 && (
                <div className="mt-2">
                  <ValidationMessages
                    input={profilePictureErrors}
                    status={profilePictureStatus}
                    message={null}
                  />
                </div>
              )}

              <UserInfo userStatus="offline" role={data.role} />

              <h3 className="text-center text-gray-300 my-5">Storage</h3>
              <StorageChart {...{ usedBytes, limitBytes, remainingBytes }} />
            </div>

            <ProfileRightContent
              updateData={updateData}
              errorMessages={errorMessages}
              status={null}
              onBioChange={(bio) => setUpdateData({ bio })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
