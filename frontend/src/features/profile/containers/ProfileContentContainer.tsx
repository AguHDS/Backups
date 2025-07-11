import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useEditableProfile } from "../hooks/useEditableProfile";
import { useProfile, useSections, useFileDeletion } from "../context";
import { useFetch } from "../../../shared";
import {
  Header,
  ActionsAndProfileImg,
  Graph,
  UserInfo,
  Storage,
  ProfileRightContent,
} from "../components";
import { images } from "../../../assets/images";
import { FetchedUserProfile } from "../types/profileData";

type ValidationError = { msg: string };
type ApiError = { message: string };
type FetchError = Error | ValidationError[] | ApiError | unknown;

// helper function to process error messages in edit mode
const processErrorMessages = (error: FetchError): string[] => {
  if (Array.isArray(error)) {
    return error.map((err: ValidationError) => err.msg);
  }
  if (error && typeof error === "object" && "message" in error) {
    return [error.message as string];
  }
  return ["An unexpected error occurred"];
};

/* Handles profile editing logic for bio, sections, files
   and renders the full profile. This uses SectionsContext (in ProfileContextProvider) to access section states */
export const ProfileContentContainer = ({ data }: FetchedUserProfile) => {
  const { isEditing, setIsEditing } = useProfile();
  const { filesToDelete, clearFilesToDelete } = useFileDeletion();
  const { status, setStatus, fetchData } = useFetch();
  const { username } = useParams();
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const { updateData, setUpdateData, reset } = useEditableProfile(data.userProfileData.bio);
  const { sections, setSections, sectionsToDelete, setSectionsToDelete } = useSections();

  useEffect(() => {
    if (isEditing) {
      setErrorMessages([]);
      setStatus(null);
    }
  }, [isEditing]);

  const validateFields = () => {
    const errors: string[] = [];
    if (!updateData.bio.trim()) errors.push("Bio cannot be empty");

    sections.forEach((section, index) => {
      if (!section.title.trim())
        errors.push(`Section ${index + 1} title is empty`);
      if (!section.description.trim())
        errors.push(`Section ${index + 1} description is empty`);
    });

    return errors;
  };

  const handleSave = async () => {
    const errors = validateFields();
    if (errors.length > 0) {
      setErrorMessages(errors);
      return;
    }

    try {
      // Delete sections
      if (sectionsToDelete.length > 0) {
        const res = await fetch(`http://localhost:${import.meta.env.VITE_BACKENDPORT}/api/deleteSections/${username}`,
          {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sectionIds: sectionsToDelete }),
          }
        );
        if (!res.ok) throw new Error("Failed to delete sections");
      }

      // Delete marked files
      if (filesToDelete.length > 0) {
        const res = await fetch(`http://localhost:${import.meta.env.VITE_BACKENDPORT}/api/deleteFiles/${username}`,
          {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(filesToDelete),
          }
        );
        if (!res.ok) throw new Error("Failed to delete files");
      }

      // Prevent deleted marked files to render after saving
      setSections((prevSections) =>
        prevSections.map((section) => {
          const filesForSection = filesToDelete.find((f) => f.sectionId === section.id);
          if (!filesForSection) return section;

          return {
            ...section,
            files: (section.files || []).filter(
              (file) => !filesForSection.publicIds.includes(file.publicId)
            ),
          };
        })
      );

      // Update bio and sections
      await fetchData(`http://localhost:${import.meta.env.VITE_BACKENDPORT}/api/updateBioAndSections/${username}`,
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

      setSectionsToDelete([]);
      clearFilesToDelete();
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      const messages = processErrorMessages(error);
      setErrorMessages(messages);
    }
  };

  const handleCancel = () => {
    reset(data.userProfileData.bio);
    setErrorMessages([]);
    setStatus(null);
    setIsEditing(false);
  };

  return (
    <div className="mx-auto flex justify-center mt-5">
      <div className="w-[80vw] max-w-full">
        <Header
          username={data.username}
          onSave={handleSave}
          onCancel={handleCancel}
        />
        <div className="p-[8px] bg-[#121212] border-[#272727] border-solid border-r border-b text-[#e0e0e0]">
          <div className="flex flex-col md:flex-row w-full">
            {/* Left Sidebar */}
            <div className="bg-[#272727] p-2 flex-shrink-0 w-full md:w-[225px]">
              <ActionsAndProfileImg
                profilePic={images.testImage}
                giftIcon={images.giftIcon}
                msgIcon={images.msgIcon}
                addFriendIcon={images.addFriend}
              />
              <UserInfo
                userStatus="offline"
                role={data.role}
                friendsCounter={data.userProfileData.friends}
                partner={data.userProfileData.partner}
              />
              <h3 className="text-center my-5">Storage</h3>
              <Graph graphTestImage={images.graph} />
              <Storage
                maxSpace="6 GB"
                available="2 GB"
                used="3 GB"
                shared="1 GB"
              />
            </div>

            {/* Right Content */}
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
