import React from "react";
import { Button, AuthFeedback } from "../../../shared";
import { Bio } from "./Bio";
import { ImageUploader } from "./ImageUploader";
import { useProfile } from "../../../features/profile/context/ProfileContext";
import { Section } from "../types/profileSection.js";

interface Props {
  updateData: { bio: string };
  sections: Section[];
  errorMessages: string[];
  status: number | null;
  onBioChange: (bio: string) => void;
  onChangeSection: (
    field: "title" | "description",
    value: string,
    index: number
  ) => void;
  onDeleteSection: (sectionId: number) => void;
  onAddSection: () => void;
  onSave: () => void;
}

export const ProfileContent = ({
  updateData,
  sections,
  errorMessages,
  status,
  onBioChange,
  onChangeSection,
  onDeleteSection,
  onAddSection,
  onSave,
}: Props) => {
  const { isEditing } = useProfile();

  return (
    <div className="w-full mr-[5px] ml-[5px] scrollbar-container flex flex-col h-full min-h-[80vh]">
      <div className="bg-[#272727] w-full max-w-full flex-1">
        <div className="p-4 space-y-4 scrollbar-container flex-1">
          <Bio bio={updateData.bio} onBioChange={onBioChange} />
          <div className="border-[#121212] border-solid w-full"></div>

          {sections.map((section, index) => (
            <React.Fragment key={section.id !== 0 ? section.id : `new-${index}`}>
              <div className="mb-6">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => onDeleteSection(section.id)}
                      className="ml-auto mb-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Delete Section
                    </button>
                    <div className="flex justify-center">
                      <input
                        type="text"
                        className="w-[25%] text-center bg-[#272727] text-white text-[18px] p-2 mb-4 border border-[#444]"
                        placeholder="Title for Section"
                        value={section.title}
                        onChange={(e) =>
                          onChangeSection("title", e.target.value, index)
                        }
                      />
                    </div>
                  </>
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
                      onChange={(e) =>
                        onChangeSection("description", e.target.value, index)
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
                    <ImageUploader />
                  </>
                ) : (
                  <>
                    <p className="flex items-center text-gray-200">
                      {section.description}
                    </p>
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
              onClick={onAddSection}
            />
            <Button
              label="Save"
              className="backupsBtn bg-[#3c3c3c]"
              onClick={onSave}
            />
          </div>
        )}
      </div>
    </div>
  );
};
