import { useContext, useMemo } from "react";
import { SectionsContext, SectionsContextType } from "./SectionsProvider";

export const useSections = (): SectionsContextType => {
  const context = useContext(SectionsContext);
  if (!context) {
    throw new Error("useSections must be used within a SectionsProvider");
  }
  return context;
};

export const useSection = (index: number) => {
  const { sections } = useSections();
  const section = sections[index];
  
  return useMemo(() => {
    return section;
  }, [section]);
};