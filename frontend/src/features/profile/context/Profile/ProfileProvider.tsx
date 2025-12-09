import { createContext, useState, ReactNode } from "react";

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

  return (
    <ProfileContext.Provider value={{ isEditing, setIsEditing, isOwnProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
