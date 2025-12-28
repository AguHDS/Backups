import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "@tanstack/react-router";
import { useEditBio } from "../hooks/useEditBio";
import {
  useEditProfile,
  useSections,
  useFileDeletion,
} from "../context";
import { useStorageData } from "../hooks/useStorageData";
import {
  useUpdateBioAndSections,
  useDeleteSections,
  useDeleteFiles,
  useUploadProfilePicture,
} from "../hooks/useProfileMutations";
import {
  Header,
  ActionsAndProfileImg,
  UserInfo,
  StorageChart,
  ProfileRightContent,
} from "../components";
import type { FetchedUserProfile } from "../types/profileData";
import { processErrorMessages } from "@/shared/utils/processErrorMessages";
import { ValidationMessages } from "@/shared";
import { useInvalidateDashboard } from "@/features/dashboard/hooks/useDashboard";

export const ProfileContentContainer = ({ data }: FetchedUserProfile) => {
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageRefreshKey, setImageRefreshKey] = useState<number>(0);
  const [profileImagePublicId, setProfileImagePublicId] = useState<string>(
    data.userProfileData.profile_pic || ""
  );
  const [profilePictureErrors, setProfilePictureErrors] = useState<string[]>(
    []
  );
  const [currentBio, setCurrentBio] = useState<string>(
    data.userProfileData.bio
  );
  const { isEditing, setIsEditing } = useEditProfile();
  const { usedBytes, limitBytes, remainingBytes } = useStorageData();
  const { filesToDelete, clearFilesToDelete } = useFileDeletion();
  const params = useParams({ strict: false });
  const username = params.username as string;
  const invalidateDashboard = useInvalidateDashboard();
  const { updateData, setUpdateData, resetBio } = useEditBio(currentBio);
  const {
    sections,
    sectionsToDelete,
    setSectionsToDelete,
    updateSectionIds,
    resetSections,
    updateInitialSections,
  } = useSections();
  const isInitialMount = useRef(true);

  // Mutations
  const updateBioAndSectionsMutation = useUpdateBioAndSections();
  const deleteSectionsMutation = useDeleteSections();
  const deleteFilesMutation = useDeleteFiles();
  const uploadProfilePictureMutation = useUploadProfilePicture();

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

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, []);

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
      // Upload profile picture if selected
      if (selectedImage) {
        setProfilePictureErrors([]);

        const formData = new FormData();
        formData.append("profilePicture", selectedImage);

        try {
          const uploadResponse = await uploadProfilePictureMutation.mutateAsync(
            {
              username,
              formData,
            }
          );

          if (uploadResponse.data?.public_id) {
            setProfileImagePublicId(uploadResponse.data.public_id);
            setImageRefreshKey((prev) => prev + 1);
            setProfilePictureErrors([]);
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to upload profile picture";
          setProfilePictureErrors([errorMessage]);
        }
      }

      // Delete sections if any
      if (sectionsToDelete.length > 0) {
        await deleteSectionsMutation.mutateAsync({
          username,
          data: { sectionIds: sectionsToDelete },
        });
      }

      // Delete files if any
      if (filesToDelete.length > 0) {
        // Delete files for each section
        await Promise.all(
          filesToDelete.map((deletion) =>
            deleteFilesMutation.mutateAsync({
              username,
              data: {
                filePublicIds: deletion.publicIds,
                sectionId: deletion.sectionId,
              },
            })
          )
        );
      }

      // Update bio and sections
      const responseData = await updateBioAndSectionsMutation.mutateAsync({
        username,
        data: {
          bio: updateData.bio,
          sections,
        },
      });

      if (responseData.newlyCreatedSections) {
        updateSectionIds(responseData.newlyCreatedSections);
      }

      setCurrentBio(updateData.bio);

      const sectionsWithUpdatedIds = sections.map((section) => {
        if (responseData.newlyCreatedSections) {
          const newId = responseData.newlyCreatedSections.find(
            (item: { tempId: number }) => item.tempId === section.id
          );
          if (newId) {
            return { ...section, id: newId.newId };
          }
        }
        return section;
      });

      updateInitialSections(sectionsWithUpdatedIds);

      setSectionsToDelete([]);
      clearFilesToDelete();
      setSelectedImage(null);
      setPreviewUrl(null);
      setErrorMessages([]);
      setIsEditing(false);

      invalidateDashboard();
    } catch (error) {
      console.error("Error saving profile:", error);
      const messages = processErrorMessages(error);
      setErrorMessages(messages);
    }
  }, [
    validateFields,
    selectedImage,
    sections,
    sectionsToDelete,
    filesToDelete,
    updateData.bio,
    username,
    setSectionsToDelete,
    clearFilesToDelete,
    setIsEditing,
    updateSectionIds,
    updateInitialSections,
    uploadProfilePictureMutation,
    deleteSectionsMutation,
    deleteFilesMutation,
    updateBioAndSectionsMutation,
    invalidateDashboard,
  ]);

  const handleCancel = useCallback(() => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setErrorMessages([]);
    setProfilePictureErrors([]);
    resetSections();
    resetBio(currentBio);
    setIsEditing(false);
  }, [resetSections, resetBio, currentBio, setIsEditing]);

  const handleSelectImage = useCallback((file: File) => {
    setSelectedImage(file);
    setProfilePictureErrors([]);
  }, []);

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
                    status={null}
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
