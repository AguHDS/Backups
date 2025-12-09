import { useContext } from "react";
import {
  StorageRefreshContext,
  StorageRefreshContextType,
} from "./StorageRefreshProvider";

export const useStorageRefresh = (): StorageRefreshContextType => {
  const context = useContext(StorageRefreshContext);
  if (!context) {
    throw new Error(
      "useStorageRefresh must be used within a StorageRefreshProvider"
    );
  }
  return context;
};
