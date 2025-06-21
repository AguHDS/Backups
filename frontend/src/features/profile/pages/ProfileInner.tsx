import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useEditableProfile } from "../hooks/useEditableProfile";
import { useProfile } from "../context/ProfileContext";
import {
  Header,
  ActionsAndProfileImg,
  Graph,
  UserInfo,
  Storage,
  ProfileContent,
} from "../components";
import { useFetch } from "../../../shared";
import { images } from "../../../assets/images";

type ValidationError = { msg: string };
type ApiError = { message: string };
type FetchError = Error | ValidationError[] | ApiError | unknown;

const processError = (error: FetchError): string[] => {
  if (Array.isArray(error)) {
    return error.map((err: ValidationError) => err.msg);
  }
  if (error && typeof error === "object" && "message" in error) {
    return [error.message as string];
  }
  return ["An unexpected error occurred"];
};

interface Props {
  data: {
    username: string;
    role: string;
    id: number;
    userProfileData: {
      bio: string;
      profile_pic?: string;
      partner: string;
      friends: number;
    };
    userSectionData: {
      id: number;
      title: string;
      description: string;
    }[];
  };
}

/**
 * this component is necessary because useProfile can only be used inside its provider
 */

export const ProfileInner = ({ data }: Props) => {
  const { isEditing, setIsEditing } = useProfile();
  const { status, setStatus, fetchData } = useFetch();
  const { username } = useParams();
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const {
    updateData,
    setUpdateData,
    sections,
    setSections,
    sectionsToDelete,
    setSectionsToDelete,
    reset,
  } = useEditableProfile(data.userProfileData.bio, data.userSectionData);

  //reset error messages when editing profile
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

      await fetchData(
        `http://localhost:${
          import.meta.env.VITE_BACKENDPORT
        }/api/updateProfile/${username}`,
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
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      const messages = processError(error);
      setErrorMessages(messages);
    }
  };

  // Reset function to clear form validation checks
  const handleCancel = () => {
    reset();
    setErrorMessages([]);
    setStatus(null);
    setIsEditing(false);
  };

  return (
    <div className="mx-auto flex justify-center mt-5">
      <div className="w-[80vw] max-w-full">
        <Header username={data.username} onSave={handleSave} onCancel={handleCancel} />
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
            <ProfileContent
              updateData={updateData}
              sections={sections}
              errorMessages={errorMessages}
              status={status!}
              onBioChange={(bio) => setUpdateData({ bio })}
              onChangeSection={(field, value, index) =>
                setSections((prev) => {
                  const updated = [...prev];
                  updated[index] = { ...updated[index], [field]: value };
                  return updated;
                })
              }
              onDeleteSection={(id) => {
                setSectionsToDelete((prev) => [...prev, id]);
                setSections((prev) => prev.filter((s) => s.id !== id));
              }}
              onAddSection={() =>
                setSections((prev) => [
                  ...prev,
                  { id: 0, title: "", description: "" },
                ])
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
