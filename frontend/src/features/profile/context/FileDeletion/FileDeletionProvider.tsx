import { createContext, useState, type ReactNode, useCallback, useMemo } from "react";

export type PendingDeletion = {
  sectionId: number;
  publicIds: string[];
};

export type FilesToDeleteContextType = {
  filesToDelete: PendingDeletion[];
  addFilesToDelete: (sectionId: number, ids: string[]) => void;
  clearFilesToDelete: () => void;
};

export const FileDeletionContext =
  createContext<FilesToDeleteContextType | null>(null);

interface FileDeletionProviderProps {
  children: ReactNode;
}

export const FileDeletionProvider = ({
  children,
}: FileDeletionProviderProps) => {
  const [filesToDelete, setFilesToDelete] = useState<PendingDeletion[]>([]);

  const addFilesToDelete = useCallback((sectionId: number, newIds: string[]) => {
    setFilesToDelete((prev) => {
      const existing = prev.find((entry) => entry.sectionId === sectionId);

      if (existing) {
        return prev.map((entry) =>
          entry.sectionId === sectionId
            ? {
                ...entry,
                publicIds: Array.from(new Set([...entry.publicIds, ...newIds])),
              }
            : entry
        );
      } else {
        return [...prev, { sectionId, publicIds: newIds }];
      }
    });
  }, []);

  const clearFilesToDelete = useCallback(() => {
    setFilesToDelete([]);
  }, []);

  const contextValue = useMemo(
    () => ({ filesToDelete, addFilesToDelete, clearFilesToDelete }),
    [filesToDelete, addFilesToDelete, clearFilesToDelete]
  );

  return (
    <FileDeletionContext.Provider value={contextValue}>
      {children}
    </FileDeletionContext.Provider>
  );
};
