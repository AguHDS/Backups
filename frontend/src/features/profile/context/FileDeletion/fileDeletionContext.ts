import { useContext } from "react";
import {
  FileDeletionContext,
  type FilesToDeleteContextType,
} from "./FileDeletionProvider";

export const useFileDeletion = (): FilesToDeleteContextType => {
  const context = useContext(FileDeletionContext);
  if (!context) {
    throw new Error(
      "useFileDeletion must be used within a FileDeletionProvider"
    );
  }
  return context;
};
