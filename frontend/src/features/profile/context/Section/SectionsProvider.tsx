import {
  createContext,
  useState,
  type ReactNode,
  useCallback,
  useMemo,
  useRef,
} from "react";
import type { SectionWithFile, UploadedFile } from "@/features/profile/types/section";

interface SectionsContextType {
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
  removeFilesFromSection: (sectionId: number, filePublicIds: string[]) => void;
  updateSectionIds: (idMap: { tempId: number; newId: number }[]) => void;
  resetSections: () => void;
  updateInitialSections: (newSections: SectionWithFile[]) => void;
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
  const initialSectionsRef = useRef<SectionWithFile[]>(initialSections);

  const [sections, setSections] = useState<SectionWithFile[]>(initialSections);
  const [sectionsToDelete, setSectionsToDelete] = useState<number[]>([]);

  const updateSection = useCallback(
    (
      index: number,
      field: "title" | "description" | "isPublic",
      value: string | boolean
    ) => {
      setSections((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [field]: value };
        return updated;
      });
    },
    []
  );

  const addSection = useCallback(() => {
    setSections((prev) => [
      ...prev,
      { id: 0, title: "", description: "", files: [], isPublic: true },
    ]);
  }, []);

  const deleteSection = useCallback((sectionId: number) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
    setSectionsToDelete((prev) => [...prev, sectionId]);
  }, []);

  const renderFilesOnResponse = useCallback(
    (sectionId: number, newFiles: UploadedFile[]) => {
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
    },
    []
  );

  const removeFilesFromSection = useCallback(
    (sectionId: number, filePublicIds: string[]) => {
      setSections((prev) =>
        prev.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                files: (section.files || []).filter(
                  (file) => !filePublicIds.includes(file.publicId)
                ),
              }
            : section
        )
      );
    },
    []
  );

  const updateSectionIds = useCallback(
    (idMap: { tempId: number; newId: number }[]) => {
      setSections((prevSections) => {
        const updatedSections = prevSections.map((section) => {
          const match = idMap.find((n) => n.tempId === section.id);
          return match ? { ...section, id: match.newId } : section;
        });

        initialSectionsRef.current = updatedSections;

        return updatedSections;
      });
    },
    []
  );

  const updateInitialSections = useCallback(
    (newSections: SectionWithFile[]) => {
      initialSectionsRef.current = [...newSections];
      setSections([...newSections]);
    },
    []
  );

  const resetSections = useCallback(() => {
    setSections([...initialSectionsRef.current]);
    setSectionsToDelete([]);
  }, []);

  const contextValue = useMemo(
    () => ({
      sections,
      setSections,
      sectionsToDelete,
      setSectionsToDelete,
      updateSection,
      addSection,
      deleteSection,
      renderFilesOnResponse,
      removeFilesFromSection,
      updateSectionIds,
      resetSections,
      updateInitialSections,
    }),
    [
      sections,
      sectionsToDelete,
      updateSection,
      addSection,
      deleteSection,
      renderFilesOnResponse,
      removeFilesFromSection,
      updateSectionIds,
      resetSections,
      updateInitialSections,
    ]
  );

  return (
    <SectionsContext.Provider value={contextValue}>
      {children}
    </SectionsContext.Provider>
  );
};
