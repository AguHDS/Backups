import { createContext, useState, type ReactNode, useMemo } from "react";

export interface EditProfileContextType {
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  isOwnProfile: boolean;
}

export const EditProfileContext = createContext<EditProfileContextType | null>(
  null
);

interface EditProfileProviderProps {
  children: ReactNode;
  isOwnProfile: boolean;
}

/**
 * Manages permission to edit profile based on ownership
 */
export const EditProfileProvider = ({
  children,
  isOwnProfile,
}: EditProfileProviderProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const contextValue = useMemo(
    () => ({ isEditing, setIsEditing, isOwnProfile }),
    [isEditing, isOwnProfile]
  );

  return (
    <EditProfileContext.Provider value={contextValue}>
      {children}
    </EditProfileContext.Provider>
  );
};
