import React, { useState, useEffect } from "react";
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
  const [sectionsToDelete, setSectionsToDelete] = useState<number[]>([]);
  const { status, isLoading, error, fetchData } = useFetch();
  const { username } = useParams();
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const { isEditing } = useProfile();

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

  const processError = (error: FetchError): string[] => {
    if (Array.isArray(error)) {
      return error.map((err: ValidationError) => err.msg);
    }
    if (error && typeof error === "object" && "message" in error) {
      return [error.message as string];
    }
    return ["An unexpected error occurred"];
  };

  const handleUpdateProfile = async () => {
    const validationErrors = validateFields();
    if (validationErrors.length > 0) {
      setErrorMessages(validationErrors);
      return;
    }

    try {
      if (sectionsToDelete.length > 0) {
        await fetch(
          `http://localhost:${import.meta.env.VITE_BACKENDPORT}/api/deleteSections/${username}`,
          {
            method: "DELETE",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ sectionIds: sectionsToDelete }),
          }
        );
      }

      await fetchData(
        `http://localhost:${import.meta.env.VITE_BACKENDPORT}/api/updateProfile/${username}`,
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

      setSectionsToDelete([]);
    } catch (error) {
      console.error("Failed to update profile:", error);
      setErrorMessages(["Failed to update profile. Try again later"]);
    }
  };

  const handleBioChange = (newBio: string) => {
    setUpdateData((prev) => ({ ...prev, bio: newBio }));
  };

  const handleChangeSection = (field: SectionField, value: string, index: number) => {
    setSections((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };

  const markSectionForDeletion = (sectionId: number) => {
    setSectionsToDelete((prev) => [...prev, sectionId]);
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
  };

  const addNewSection = async () => {
    setSections((prev) => [
      ...prev,
      {
        id: 0,
        title: "",
        description: "",
      },
    ]);
  };

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
          <div className="border-[#121212] border-solid w-full"></div>

          {sections.map((section, index) => (
            <React.Fragment key={section.id}>
              <div className="mb-6">
                {isEditing ? (
                  <div className="flex justify-center">
                    <input
                      type="text"
                      className="w-[25%] text-center bg-[#272727] text-white text-[18px] p-2 mb-4 border border-[#444]"
                      placeholder="Title for Section"
                      value={section.title}
                      onChange={(e) => handleChangeSection("title", e.target.value, index)}
                    />
                  </div>
                ) : (
                  <h3 className="text-center text-[#ccc] text-[18px] mb-2 border-t-[10px] pt-3 w-full">
                    {section.title}
                  </h3>
                )}

                {isEditing ? (
                  <>
                    <textarea
                      className="w-[95%] bg-[#272727] text-[#ccc] text-[14px] p-2 mb-2 border border-[#444] resize-none"
                      rows={3}
                      placeholder="Add a new description"
                      value={section.description}
                      onChange={(e) => handleChangeSection("description", e.target.value, index)}
                    ></textarea>
                    <button
                      onClick={() => markSectionForDeletion(section.id)}
                      className="ml-auto mb-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Eliminar sección
                    </button>
                    <AuthFeedback
                      input={errorMessages}
                      status={status}
                      message={errorMessages.length === 0 ? "Operation completed" : null}
                    />
                    <ImageUploader />
                  </>
                ) : (
                  <>
                    <p className="flex items-center text-gray-200">{section.description}</p>
                    <div className="mb-4">
                      <ImageUploader />
                    </div>
                  </>
                )}
              </div>
              <div className="border-[#121212] border-solid w-full"></div>
            </React.Fragment>
          ))}
        </div>
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
