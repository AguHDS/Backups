import { useContext, useMemo } from "react";
import { SectionsContext, SectionsContextType } from "./SectionsProvider";

export const useSections = (): SectionsContextType => {
  const context = useContext(SectionsContext);
  if (!context) {
    throw new Error("useSections must be used within a SectionsProvider");
  }
  return context;
};

// Hook to get a specific section by index - memoized to prevent re-renders
export const useSection = (index: number) => {
  const { sections } = useSections();
  return useMemo(() => sections[index], [sections, index]);
};
