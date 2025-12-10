import { createContext, useState, ReactNode } from "react";
import { SectionWithFile, UploadedFile } from "../../types/section";

export interface SectionsContextType {
  sections: SectionWithFile[];
  setSections: React.Dispatch<React.SetStateAction<SectionWithFile[]>>;
  sectionsToDelete: number[];
  setSectionsToDelete: React.Dispatch<React.SetStateAction<number[]>>;
  updateSection: (
    index: number,
    field: "title" | "description" | "isPublic",
    value: string | boolean
  ) => void;
  addSection: () => void;
  deleteSection: (sectionId: number) => void;
  renderFilesOnResponse: (sectionId: number, newFiles: UploadedFile[]) => void;
  updateSectionIds: (idMap: { tempId: number; newId: number }[]) => void;
}

export const SectionsContext = createContext<SectionsContextType | undefined>(
  undefined
);

interface SectionsProviderProps {
  children: ReactNode;
  initialSections: SectionWithFile[];
}

export const SectionsProvider = ({
  children,
  initialSections,
}: SectionsProviderProps) => {
  const [sections, setSections] = useState<SectionWithFile[]>(initialSections);
  const [sectionsToDelete, setSectionsToDelete] = useState<number[]>([]);

  const updateSection = (
    index: number,
    field: "title" | "description" | "isPublic",
    value: string | boolean
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
      { id: 0, title: "", description: "", files: [], isPublic: true },
    ]);
  };

  const deleteSection = (sectionId: number) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
    setSectionsToDelete((prev) => [...prev, sectionId]);
  };

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

  const updateSectionIds = (idMap: { tempId: number; newId: number }[]) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        const match = idMap.find((n) => n.tempId === section.id);
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
