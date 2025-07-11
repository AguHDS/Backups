import React, { createContext, useContext, useState } from "react";
import { SectionWithFile, UploadedFile } from "../types/section";

interface SectionsContextType {
  sections: SectionWithFile[];
  setSections: React.Dispatch<React.SetStateAction<SectionWithFile[]>>;
  sectionsToDelete: number[];
  setSectionsToDelete: React.Dispatch<React.SetStateAction<number[]>>;
  updateSection: (
    index: number,
    field: "title" | "description",
    value: string
  ) => void;
  addSection: () => void;
  deleteSection: (sectionId: number) => void;
  renderFilesOnResponse: (sectionId: number, newFiles: UploadedFile[]) => void;
  updateSectionIds: (idMap: { tempId: number; newId: number }[]) => void;
}

const SectionsContext = createContext<SectionsContextType | undefined>(
  undefined
);

interface Props {
  children: React.ReactNode;
  initialSections: SectionWithFile[];
}

export const SectionsProvider = ({ children, initialSections }: Props) => {
  const [sections, setSections] = useState<SectionWithFile[]>(initialSections);
  const [sectionsToDelete, setSectionsToDelete] = useState<number[]>([]);

  const updateSection = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    setSections((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addSection = () => {
    setSections((prev) => [
      ...prev,
      { id: 0, title: "", description: "", files: [] },
    ]);
  };

  const deleteSection = (sectionId: number) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
    setSectionsToDelete((prev) => [...prev, sectionId]);
  };

  // Render images at the moment they are uploaded
  const renderFilesOnResponse = (
    sectionId: number,
    newFiles: UploadedFile[]
  ) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              files: [...(section.files || []), ...newFiles],
            }
          : section
      )
    );
  };

  // Update the local state of sections by replacing temporary ids with real ids from the backend
  const updateSectionIds = (idMap: { tempId: number; newId: number }[]) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        // Find if this section's id matches any temporal id from the map
        const match = idMap.find((n) => n.tempId === section.id);
        // If it matches, replace it with the real one
        return match ? { ...section, id: match.newId } : section;
      })
    );
  };

  return (
    <SectionsContext.Provider
      value={{
        sections,
        setSections,
        sectionsToDelete,
        setSectionsToDelete,
        updateSection,
        addSection,
        deleteSection,
        renderFilesOnResponse,
        updateSectionIds,
      }}
    >
      {children}
    </SectionsContext.Provider>
  );
};

export const useSections = () => {
  const context = useContext(SectionsContext);
  if (!context) throw new Error("useSections must be used inside its provider");
  return context;
};
