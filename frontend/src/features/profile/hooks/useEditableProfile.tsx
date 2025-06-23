import { useState, useEffect } from "react";

/* Manages editable profile bio state 
allowing updates and reset to original value when editing is cancelled */

export const useEditableProfile = (bio: string) => {
  const [updateData, setUpdateData] = useState({ bio });

  const reset = (originalBio: string) => {
    setUpdateData({ bio: originalBio });
  };

  useEffect(() => {
    setUpdateData({ bio });
  }, [bio]);

  return {
    updateData,
    setUpdateData,
    reset,
  };
};
