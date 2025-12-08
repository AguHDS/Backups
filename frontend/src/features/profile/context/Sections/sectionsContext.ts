import { useContext } from "react";
import { SectionsContext, SectionsContextType } from "./SectionsProvider";

export const useSections = (): SectionsContextType => {
  const context = useContext(SectionsContext);
  if (!context) {
    throw new Error("useSections must be used within a SectionsProvider");
  }
  return context;
};
