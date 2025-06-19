import { useState, useEffect } from "react";
import { Section } from "../types/profileSection.js";


export const useEditableProfile = (bio: string, initialSections: Section[]) => {
  const [updateData, setUpdateData] = useState({ bio });
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [sectionsToDelete, setSectionsToDelete] = useState<number[]>([]);

  //restore data when canceling edit
  const reset = () => {
    setUpdateData({ bio });
    setSections(initialSections);
    setSectionsToDelete([]);
  };

  //restore data to its original state to ensure cancel button works correctly
  useEffect(() => {
    setUpdateData({ bio });
    setSections(initialSections);
  }, [bio, initialSections]);

  return {
    updateData,
    setUpdateData,
    sections,
    setSections,
    sectionsToDelete,
    setSectionsToDelete,
    reset,
  };
};
