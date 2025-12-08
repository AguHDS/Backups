import { createContext, useState, ReactNode } from "react";

export interface StorageRefreshContextType {
  flag: boolean;
  refresh: () => void;
}

export const StorageRefreshContext = createContext<
  StorageRefreshContextType | undefined
>(undefined);

export const StorageRefreshProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [flag, setFlag] = useState(false);

  const refresh = () => setFlag((prev) => !prev);

  return (
    <StorageRefreshContext.Provider value={{ flag, refresh }}>
      {children}
    </StorageRefreshContext.Provider>
  );
};
