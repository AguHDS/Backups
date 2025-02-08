import { createContext, useContext, useState, ReactNode } from "react";

interface ProfileContextType {
    isEditing: boolean;
    setIsEditing: (value: boolean)=> void;
    isOwnProfile: boolean;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

interface Props {
    children: ReactNode;
    isOwnProfile: boolean;
}

export const ProfileProvider = ({children, isOwnProfile}: Props) => {
  const [isEditing, setIsEditing] = useState<boolean>(false)

  return (
    <ProfileContext.Provider value={{isEditing, setIsEditing, isOwnProfile}}>
      {children}
    </ProfileContext.Provider>
  )
}

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
      throw new Error("useProfile debe usarse dentro de un ProfileProvider");
    }
    return context;
  };