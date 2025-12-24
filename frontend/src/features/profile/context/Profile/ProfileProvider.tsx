import { createContext, useState, type ReactNode, useMemo } from "react";

export interface ProfileContextType {
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  isOwnProfile: boolean;
}

export const ProfileContext = createContext<ProfileContextType | null>(null);

interface ProfileProviderProps {
  children: ReactNode;
  isOwnProfile: boolean;
}

export const ProfileProvider = ({
  children,
  isOwnProfile,
}: ProfileProviderProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const contextValue = useMemo(
    () => ({ isEditing, setIsEditing, isOwnProfile }),
    [isEditing, isOwnProfile]
  );

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
};
