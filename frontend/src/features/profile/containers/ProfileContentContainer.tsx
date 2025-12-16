import { useEffect, useState, useCallback } from "react";
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
  StorageGraph,
  ProfileRightContent,
} from "../components";
import { images } from "@/assets/images";
import { FetchedUserProfile } from "../types/profileData";
import { processErrorMessages } from "@/shared/utils/errors";
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
  const { isEditing, setIsEditing } = useProfile();
  const { flag: storageRefreshFlag, refresh: refreshStorage } =
    useStorageRefresh();
  const { usedBytes, limitBytes, remainingBytes } =
    useStorageData(storageRefreshFlag);

  const { filesToDelete, clearFilesToDelete } = useFileDeletion();
  const {
    fetchData,
    data: uploadResponse,
    status,
    setStatus,
  } = useFetch<{ data: { public_id: string } }>();
  const { username } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { updateData, setUpdateData } = useEditBio(
    data.userProfileData.bio
  );
  const {
    sections,
    setSections,
    sectionsToDelete,
    setSectionsToDelete,
    updateSectionIds,
  } = useSections();
  
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

  // Updates profile picture after successful upload
  useEffect(() => {
    if (uploadResponse?.data?.public_id) {
      setProfileImagePublicId(uploadResponse.data.public_id);
      setImageRefreshKey(prev => prev + 1);
      setPreviewUrl(null); // Clear preview after successful upload
      setSelectedImage(null);
    }
  }, [uploadResponse]);

  useEffect(() => {
    if (isEditing) {
      setErrorMessages([]);
      setStatus(null);
    }
  }, [isEditing, setStatus]);

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

  const handleSave = useCallback(async () => {
    const errors = validateFields();
    if (errors.length > 0) {
      setErrorMessages(errors);
      return;
    }

    try {
      // Upload profile picture
      if (selectedImage) {
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
      }

      // Delete/update logic
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
      setIsEditing(false);

      refreshStorage();
      await dispatch(getDashboardSummary());
    } catch (error) {
      console.error("Error saving profile:", error);
      setErrorMessages(processErrorMessages(error));
    }
  }, [
    validateFields,
    selectedImage,
    fetchData,
    sections,
    sectionsToDelete,
    filesToDelete,
    updateData.bio,
    username,
    setSections,
    setSectionsToDelete,
    clearFilesToDelete,
    setIsEditing,
    refreshStorage,
    dispatch,
    updateSectionIds,
  ]);

  return (
    <div className="mx-auto flex justify-center mt-5">
      <div className="w-[80vw] max-w-full">
        <Header
          username={data.username}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />

        <div className="p-[8px] bg-[#121212] border-[#272727] border-r border-b">
          <div className="flex flex-col md:flex-row w-full">
            <div className="bg-[#272727] p-2 w-full md:w-[225px]">
              <ActionsAndProfileImg
                profilePic={profileImagePublicId}
                previewUrl={previewUrl}
                isEditing={isEditing}
                onSelectImage={setSelectedImage}
                refreshKey={imageRefreshKey}
              />

              <UserInfo userStatus="offline" role={data.role} />

              <h3 className="text-center my-5">Storage</h3>
              <StorageGraph {...{ usedBytes, limitBytes, remainingBytes }} />
            </div>

            <ProfileRightContent
              updateData={updateData}
              errorMessages={errorMessages}
              status={status!}
              onBioChange={(bio) => setUpdateData({ bio })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};