import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

interface ProfileStorage {
  used: number;
  limit: number;
  remaining: number;
}

// Hook to fetch and manage storage data independently
export const useStorageData = (refreshTrigger?: boolean) => {
  const [storage, setStorage] = useState<ProfileStorage>({
    used: 0,
    limit: 0,
    remaining: 0,
  });
  const { username } = useParams();

  useEffect(() => {
    const fetchStorage = async () => {
      if (!username) return;
      try {
        const res = await fetch(
          `http://localhost:${import.meta.env.VITE_BACKENDPORT}/api/getStorage/${username}`
        );
        if (!res.ok) throw new Error("Failed to fetch profile storage");
        const data = await res.json();
        setStorage({
          used: Number(data.used) || 0,
          limit: Number(data.limit) || 0,
          remaining: Number(data.remaining) || 0,
        });
      } catch (err) {
        console.error("Error fetching profile storage:", err);
      }
    };
    fetchStorage();
  }, [username, refreshTrigger]);

  return {
    usedBytes: storage.used,
    limitBytes: storage.limit,
    remainingBytes: storage.remaining,
  };
};
