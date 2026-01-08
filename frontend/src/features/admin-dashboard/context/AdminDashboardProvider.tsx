import {
  createContext,
  useState,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";
import type { User, UserSection } from "../api/adminTypes";

export interface AdminDashboardContextType {
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  userSections: UserSection[];
  setUserSections: (sections: UserSection[]) => void;
  selectedSectionIds: number[];
  toggleSectionSelection: (sectionId: number) => void;
  clearSectionSelection: () => void;
}

export const AdminDashboardContext =
  createContext<AdminDashboardContextType | null>(null);

interface AdminDashboardProviderProps {
  children: ReactNode;
}

export const AdminDashboardProvider = ({
  children,
}: AdminDashboardProviderProps) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userSections, setUserSections] = useState<UserSection[]>([]);
  const [selectedSectionIds, setSelectedSectionIds] = useState<number[]>([]);

  const toggleSectionSelection = useCallback((sectionId: number) => {
    setSelectedSectionIds((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  }, []);

  const clearSectionSelection = useCallback(() => {
    setSelectedSectionIds([]);
  }, []);

  const contextValue = useMemo(
    () => ({
      selectedUser,
      setSelectedUser,
      userSections,
      setUserSections,
      selectedSectionIds,
      toggleSectionSelection,
      clearSectionSelection,
    }),
    [
      selectedUser,
      userSections,
      selectedSectionIds,
      toggleSectionSelection,
      clearSectionSelection,
    ]
  );

  return (
    <AdminDashboardContext.Provider value={contextValue}>
      {children}
    </AdminDashboardContext.Provider>
  );
};
