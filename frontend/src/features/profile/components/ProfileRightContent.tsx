import { memo, Fragment } from "react";
import { Button, FeedbackMessages } from "@/shared/index";
import { Bio } from "./Bio.js";
import { SectionFileManager } from "./SectionFileManager";
import { useProfile } from "../context/Profile/profileContext.js";
import { useSections } from "../context/Section/sectionsContext.js";

interface Props {
  updateData: { bio: string };
  errorMessages: string[];
  status: number | null;
  onBioChange: (bio: string) => void;
}

// Custom comparison to prevent unnecessary re-renders
const arePropsEqual = (prevProps: Props, nextProps: Props) => {
  return (
    prevProps.updateData.bio === nextProps.updateData.bio &&
    prevProps.errorMessages.length === nextProps.errorMessages.length &&
    prevProps.status === nextProps.status &&
    prevProps.onBioChange === nextProps.onBioChange
  );
};

// Right content (bio, titles, sections)
export const ProfileRightContent = memo(({
  updateData,
  errorMessages,
  status,
  onBioChange,
}: Props) => {
  const { isEditing } = useProfile();
  const { sections, updateSection, deleteSection, addSection } = useSections();

  return (
    <div className="w-full mr-[5px] ml-[5px] scrollbar-container flex flex-col h-full min-h-[80vh]">
      <div className="bg-[#272727] w-full max-w-full flex-1">
        <div className="p-4 space-y-4 scrollbar-container flex-1">
           <FeedbackMessages
            input={errorMessages}
            status={status}
            message={errorMessages.length === 0 ? "Operation completed" : null}
          />
          
          <Bio bio={updateData.bio} onBioChange={onBioChange} />

          <div className="h-1"></div>
          <div className="border-[#121212] border-solid w-full"></div>

          {sections.length === 0 ? (
            <p className="text-center text-gray-400 my-4">
              No sections yet. Add one to get started.
            </p>
          ) : (
            sections.map((section, index) => (
              <Fragment
                key={section.id !== 0 ? section.id : `new-${index}`}
              >
                <div className="mb-6">
                  {isEditing ? (
                    <>
                      <div className="relative w-full mb-4">
                        <div className="absolute top-0 right-0">
                          <select
                            className="bg-[#272727] text-white border border-[#444] px-3 py-2 rounded text-sm"
                            value={section.isPublic ? "public" : "private"}
                            onChange={(e) =>
                              updateSection(
                                index,
                                "isPublic",
                                e.target.value === "public"
                              )
                            }
                          >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                          </select>
                        </div>

                        <div className="flex justify-center">
                          <input
                            type="text"
                            className="w-[25%] text-center bg-[#272727] text-white text-[18px] p-2 border border-[#444]"
                            placeholder="Title for Section"
                            value={section.title}
                            onChange={(e) =>
                              updateSection(index, "title", e.target.value)
                            }
                          />
                        </div>
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
                          updateSection(index, "description", e.target.value)
                        }
                      ></textarea>
                      <SectionFileManager sectionIndex={index} />
                      <Button
                        onClick={() => deleteSection(section.id)}
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
                        <SectionFileManager sectionIndex={index} />
                      </div>
                    </>
                  )}
                </div>
                <div className="h-1"></div>
                <div className="border-[#121212] border-solid w-full"></div>
              </Fragment>
            ))
          )}
        </div>

        {isEditing && (
          <div className="flex flex-col items-end space-y-2 mr-4 mb-2">
            <Button
              label="Add new section"
              className="flex justify-center items-center w-[200px] mx-auto my-2 text-center p-2 bg-[#303030] text-[#ccc] border border-[#444] hover:bg-[#333] rounded"
              onClick={addSection}
            />
          </div>
        )}
      </div>
    </div>
  );
}, arePropsEqual);
