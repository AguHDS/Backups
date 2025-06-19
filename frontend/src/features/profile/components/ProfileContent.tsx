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
}: Props) => {
  const { isEditing } = useProfile();

  return (
    <div className="w-full mr-[5px] ml-[5px] scrollbar-container flex flex-col h-full min-h-[80vh]">
      <div className="bg-[#272727] w-full max-w-full flex-1">
        <div className="p-4 space-y-4 scrollbar-container flex-1">
          <Bio bio={updateData.bio} onBioChange={onBioChange} />

          <div className="h-1"></div>
          <div className="border-[#121212] border-solid w-full"></div>

          {sections.map((section, index) => (
            <React.Fragment
              key={section.id !== 0 ? section.id : `new-${index}`}
            >
              <div className="mb-6">
                {isEditing ? (
                  <>
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
                  <h3 className="text-center text-[#ccc] my-1 text-[28px] border-t-[10px] pt-3 w-full">
                    {section.title}
                  </h3>
                )}

                {isEditing ? (
                  <>
                    <textarea
                      className="w-[95%] bg-[#272727] text-[#ccc] text-[14px] p-2 mb-2 border border-[#444] resize-none"
                      rows={3}
                      placeholder="Add new description"
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
                    <Button
                      onClick={() => onDeleteSection(section.id)}
                      className="flex justify-center mx-auto mt-5 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      label="Delete Section"
                    />
                  </>
                ) : (
                  <>
                    <p className="flex items-center text-gray-300">
                      {section.description}
                    </p>
                    <div className="mb-4">
                      <ImageUploader />
                    </div>
                  </>
                )}
              </div>
              <div className="h-1"></div>
              <div className="border-[#121212] border-solid w-full"></div>
            </React.Fragment>
          ))}
        </div>
        {isEditing && (
          <div className="flex flex-col items-end space-y-2 mr-4 mb-2">
            <Button
              label="Add new section"
              className="flex justify-center items-center w-[200px] mx-auto my-2 text-center p-2 bg-[#303030] text-[#ccc] border border-[#444] hover:bg-[#333] rounded"
              onClick={onAddSection}
            />
          </div>
        )}
      </div>
    </div>
  );
};
