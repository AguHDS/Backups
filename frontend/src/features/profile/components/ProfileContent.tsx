import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, AuthFeedback, useFetch } from "../../../shared";
import { Bio } from "./Bio";
import { ImageUploader } from "./ImageUploader";
import { useProfile } from "../../../features/profile/context/ProfileContext";

type ValidationError = {
  msg: string;
};

type ApiError = {
  message: string;
};

type FetchError = Error | ValidationError[] | ApiError | unknown;

interface Section {
  id: number;
  title: string;
  description: string;
}

type SectionField = keyof Omit<Section, "id">;

interface Props {
  bio: string;
  sections: Section[];
}

export const ProfileContent = ({ bio, sections: initialSections }: Props) => {
  const [updateData, setUpdateData] = useState({ bio });
  const [sections, setSections] = useState<Section[]>(initialSections);
  const { status, isLoading, error, fetchData } = useFetch();
  const { username } = useParams();
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const { isEditing } = useProfile();

  //utility function to validate fields
  const validateFields = (): string[] => {
    const errors: string[] = [];

    if (!updateData.bio.trim()) {
      errors.push("Bio cannot be empty");
    }

    sections.forEach((section, index) => {
      if (!section.title.trim()) {
        errors.push(`Title in section ${index + 1} cannot be empty`);
      }
      if (!section.description.trim()) {
        errors.push(`Description in section ${index + 1} cannot be empty`);
      }
    });

    return errors;
  };

  //check different types of errors from api response
  const processError = (error: FetchError): string[] => {
    if (Array.isArray(error)) {
      return error.map((err: ValidationError) => err.msg);
    }
    if (error && typeof error === "object" && "message" in error) {
      return [error.message as string];
    }
    return ["An unexpected error occurred"];
  };

  //update user profile content data
  const handleUpdateProfile = async () => {
    const validationErrors = validateFields();
    if (validationErrors.length > 0) {
      setErrorMessages(validationErrors);
      return;
    }

    try {
      await fetchData(
        `http://localhost:${
          import.meta.env.VITE_BACKENDPORT
        }/api/updateProfile/${username}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bio: updateData.bio,
            sections,
          }),
        }
      );
    } catch (error) {
      console.error("Failed to update profile:", error);
      setErrorMessages(["Failed to update profile.Try again later"]);
    }
  };

  const handleBioChange = (newBio: string) => {
    setUpdateData((prev) => ({
      ...prev,
      bio: newBio,
    }));
  };

  //handle the edition of values in sections when isEditing is true
  const handleChangeSection = (
    field: SectionField,
    value: string,
    index: number
  ) => {
    setSections((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };

  const addNewSection = async () => {
    setSections((prev) => [
      ...prev,
      {
        id: 0, //id will be assigned by the backend
        title: "",
        description: "",
      },
    ]);

    await handleUpdateProfile();
  };

  //handle side effects after fetching data
  useEffect(() => {
    if (isLoading) return;
    if (status === 200) {
      console.log("Profile updated successfully");
      window.location.reload();
    } else if (error) {
      const newErrorMessages = processError(error);
      setErrorMessages(newErrorMessages);
      console.error("Error updating profile:", error);
    }
  }, [status, error, isLoading]);

  return (
    <div className="w-full mr-[5px] ml-[5px] scrollbar-container flex flex-col h-full min-h-[80vh]">
      <div className="bg-[#272727] w-full max-w-full flex-1">
        <div className="p-4 space-y-4 scrollbar-container flex-1">
          <Bio bio={updateData.bio} onBioChange={handleBioChange} />

          {sections.map((section, index) => (
            <React.Fragment key={section.id}>
              <div className="mb-6">
                {isEditing ? (
                  <div className="flex justify-center">
                    <input
                      type="text"
                      className="w-[25%] text-center bg-[#272727] text-[#3d3c3c] text-[18px] p-2 mb-4 border border-[#444]"
                      placeholder="Title for Section"
                      value={section.title}
                      onChange={(e) =>
                        handleChangeSection("title", e.target.value, index)
                      }
                    />
                  </div>
                ) : (
                  <h2 className="text-center text-[#ccc] text-[18px] mb-2 border-t-[10px] pt-3 border-[#121212] border-solid w-full">
                    {section.title}
                  </h2>
                )}

                {isEditing ? (
                  <>
                    <textarea
                      className="w-[95%] bg-[#272727] text-[#ccc] text-[14px] p-2 mb-4 border border-[#444] resize-none"
                      rows={3}
                      placeholder="Add a new description"
                      value={section.description}
                      onChange={(e) =>
                        handleChangeSection(
                          "description",
                          e.target.value,
                          index
                        )
                      }
                    ></textarea>
                    <AuthFeedback
                      input={errorMessages}
                      status={status}
                      message={
                        errorMessages.length === 0
                          ? "Operation completed"
                          : null
                      }
                    />
                  </>
                ) : (
                  <div className="flex items-center h-12 text-gray-200">
                    {section.description}
                  </div>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
        <ImageUploader />
        {isEditing && (
          <div className="flex flex-col items-end space-y-2 mr-4 mb-2">
            <Button
              label="Add New Section"
              className="bg-[#505050] text-white"
              onClick={addNewSection} 
            />
            <Button
              label="Save"
              className="backupsBtn bg-[#3c3c3c]"
              onClick={handleUpdateProfile}
            />
          </div>
        )}
      </div>
    </div>
  );
};
