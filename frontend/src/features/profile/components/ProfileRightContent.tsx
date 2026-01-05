import { Fragment } from "react";
import { Button, ValidationMessages } from "@/shared/index";
import { Bio } from "./Bio.js";
import { SectionFileManager } from "./SectionFileManager";
import { useEditProfile } from "../context/editProfile/editProfileContext.js";
import { useSections } from "../context/Section/sectionsContext.js";

interface Props {
  updateData: { bio: string };
  errorMessages: string[];
  status: number | null;
  onBioChange: (bio: string) => void;
}

export const ProfileRightContent = ({
  updateData,
  errorMessages,
  status,
  onBioChange,
}: Props) => {
  const { isEditing } = useEditProfile();
  const { sections, updateSection, deleteSection, addSection } = useSections();

  const shouldShowSuccess =
    status && status >= 200 && status < 300 && errorMessages.length === 0;

return (
  <div className="w-full mr-[5px] ml-[5px] scrollbar-container flex flex-col h-full min-h-[80vh] overflow-x-hidden">
    <div className="bg-[#272727] w-full max-w-full flex-1 overflow-hidden">
      <div className="p-4 space-y-4 scrollbar-container flex-1 overflow-x-hidden">
        {(errorMessages.length > 0 || shouldShowSuccess) && (
          <ValidationMessages
            input={errorMessages}
            status={status}
            message={shouldShowSuccess ? "Operation completed" : null}
          />
        )}

        <Bio bio={updateData.bio} onBioChange={onBioChange} />

        {/* Separator between Bio and Sections */}
        <div className="my-8 flex items-center gap-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#3a3a3a] to-transparent"></div>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            Sections
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#3a3a3a] to-transparent"></div>
        </div>

        {sections.length === 0 ? (
          <p className="text-center text-gray-400 my-4">
            No sections yet. Add one to get started.
          </p>
        ) : (
          sections.map((section, index) => (
            <Fragment key={section.id !== 0 ? section.id : `new-${index}`}>
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

                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-[2px] w-10 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                        <input
                          type="text"
                          className="bg-[#272727] text-white text-[18px] p-2 border border-[#444] w-full max-w-[500px] box-border"
                          placeholder="Title for Section (max 50 chars)"
                          value={section.title}
                          onChange={(e) => {
                            if (e.target.value.length <= 50) {
                              updateSection(index, "title", e.target.value);
                            }
                          }}
                          maxLength={50}
                        />
                        <div className={`text-xs whitespace-nowrap ${section.title.length >= 40 ? 'text-amber-400' : 'text-gray-400'}`}>
                          {section.title.length}/50
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="h-[2px] w-10 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                      <h3 className="font-sans text-[#ccc] text-[28px] break-words max-w-full">
                        {section.title}
                      </h3>
                      {!section.isPublic && (
                        <span className="font-sans text-xs bg-blue-900/30 text-blue-300 px-2 py-1 rounded border border-blue-700/50 whitespace-nowrap">
                          Private
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {isEditing ? (
                  <>
                    <div className="w-full px-4 box-border mb-2">
                      <div className="relative">
                        <textarea
                          className="w-full box-border bg-[#272727] text-[#ccc] text-[14px] p-4 mb-1 border border-[#444] resize-none break-words whitespace-pre-wrap min-h-[80px]"
                          placeholder="Add description"
                          value={section.description || ""}
                          onChange={(e) => {
                            if (e.target.value.length <= 250) {
                              updateSection(index, "description", e.target.value);
                            }
                          }}
                          maxLength={250}
                          rows={3}
                        ></textarea>
                        <div className="text-right">
                          <span className={`text-xs ${(section.description?.length || 0) >= 450 ? 'text-amber-400' : 'text-gray-400'}`}>
                            {(section.description?.length || 0)}/250
                          </span>
                        </div>
                      </div>
                    </div>
                    <SectionFileManager sectionIndex={index} />
                    <Button
                      onClick={() => deleteSection(section.id)}
                      className="flex justify-center mx-auto mt-5 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      label="Delete Section"
                    />
                  </>
                ) : (
                  <>
                    {section.description && (
                      <div className="w-full px-4 box-border mb-4">
                        <p className="text-gray-300 break-words whitespace-pre-wrap overflow-hidden text-center px-4 py-2 bg-[#2a2a2a] rounded border border-[#333]">
                          {section.description}
                        </p>
                      </div>
                    )}
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
};
