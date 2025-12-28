import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getStorage } from "../api/profileApi";
import type { GetStorageResponse } from "../api/profileTypes";

// Hook to fetch and manage storage data independently
export const useStorageData = () => {
  const { username } = useParams({ from: "/profile/$username" });

  const { data } = useQuery<GetStorageResponse, Error>({
    queryKey: ["storage", username],
    queryFn: () => getStorage(username),
    enabled: !!username,
    placeholderData: {
      used: 0,
      limit: 0,
      remaining: 0,
    },
  });

  return {
    usedBytes: Number(data?.used) || 0,
    limitBytes: Number(data?.limit) || 0,
    remainingBytes: Number(data?.remaining) || 0,
  };
};
