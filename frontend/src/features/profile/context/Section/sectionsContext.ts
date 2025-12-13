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
// Only re-renders when the specific section at this index changes
export const useSection = (index: number) => {
  const { sections } = useSections();
  
  // Memoize based on the actual section object, not the entire array
  return useMemo(() => {
    const section = sections[index];
    // Return a stable reference unless the section's content actually changed
    return section;
  }, [
    sections[index]?.id,
    sections[index]?.title,
    sections[index]?.description,
    sections[index]?.isPublic,
    sections[index]?.files?.length,
    // We track files.length instead of the entire files array to avoid re-renders
    // when file objects are recreated but content is the same
  ]);
};
