import { useState, useEffect } from "react";

/* Manages editable profile bio state 
allowing updates and reset to original value when editing is cancelled */

export const useEditBio = (bio: string) => {
  const [updateData, setUpdateData] = useState({ bio });

  const resetBio = (originalBio: string) => {
    setUpdateData({ bio: originalBio });
  };

  useEffect(() => {
    setUpdateData({ bio });
  }, [bio]);

  return {
    updateData,
    setUpdateData,
    resetBio,
  };
};
