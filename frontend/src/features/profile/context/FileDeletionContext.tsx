import { createContext, useContext, useState } from "react";

export type PendingDeletion = {
  sectionId: number;
  publicIds: string[];
};

export type FilesToDeleteContextType = {
  filesToDelete: PendingDeletion[];
  addFilesToDelete: (sectionId: number, ids: string[]) => void;
  clearFilesToDelete: () => void;
};

const FileDeletionContext = createContext<FilesToDeleteContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

// Context to handle deletion of files marked for deletion
export const FileDeletionProvider = ({ children }: Props) => {
  const [filesToDelete, setFilesToDelete] = useState<PendingDeletion[]>([]);

  // Adds or updates files to delete for sections
  const addFilesToDelete = (sectionId: number, newIds: string[]) => {
    setFilesToDelete((prev) => {
      const existing = prev.find((entry) => entry.sectionId === sectionId);

      if (existing) {
        const updated = prev.map((entry) =>
          entry.sectionId === sectionId
            ? {
                ...entry,
                publicIds: Array.from(new Set([...entry.publicIds, ...newIds])),
              }
            : entry
        );
        return updated;
      } else {
        return [...prev, { sectionId, publicIds: newIds }];
      }
    });
  };

  const clearFilesToDelete = () => {
    setFilesToDelete([]);
  };

  return (
    <FileDeletionContext.Provider
      value={{ filesToDelete, addFilesToDelete, clearFilesToDelete }}>
      {children}
    </FileDeletionContext.Provider>
  );
};

export const useFileDeletion = (): FilesToDeleteContextType => {
  const context = useContext(FileDeletionContext);
  if (!context) {
    throw new Error("useFileDeletion must be used within a FileDeletionProvider");
  }
  return context;
};