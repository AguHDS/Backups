import { createContext, useState, type ReactNode, useCallback, useMemo } from "react";

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

  const refresh = useCallback(() => setFlag((prev) => !prev), []);

  const contextValue = useMemo(
    () => ({ flag, refresh }),
    [flag, refresh]
  );

  return (
    <StorageRefreshContext.Provider value={contextValue}>
      {children}
    </StorageRefreshContext.Provider>
  );
};
