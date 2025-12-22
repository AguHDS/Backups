import { useContext, useMemo } from "react";
import { SectionsContext } from "./SectionsProvider";

export const useSections = () => {
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