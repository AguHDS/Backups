import { createContext, useContext, useState, ReactNode } from "react";

export interface StorageRefreshContextType {
  flag: boolean;
  refresh: () => void;
}

const StorageRefreshContext = createContext<StorageRefreshContextType | undefined>(undefined);

export const StorageRefreshProvider = ({ children }: { children: ReactNode }) => {
  const [flag, setFlag] = useState(false);

  const refresh = () => setFlag((prev) => !prev);

  return (
    <StorageRefreshContext.Provider value={{ flag, refresh }}>
      {children}
    </StorageRefreshContext.Provider>
  );
};

export const useStorageRefresh = (): StorageRefreshContextType => {
  const context = useContext(StorageRefreshContext);
  if (!context) {
    throw new Error("useStorageRefresh must be used within a StorageRefreshProvider");
  }
  return context;
};
