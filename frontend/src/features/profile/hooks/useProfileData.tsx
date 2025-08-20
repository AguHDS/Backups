import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFetch, useModalContext } from "../../../shared";
import { UserProfileWithFiles } from "../types/profileData";

interface ProfileStorage {
  used: number;
  limit: number;
  remaining: number;
}

// Returns general profile data, sections and its related data, storage, and isOwnProfile flag
export const useProfileData = (refreshTrigger?: boolean) => {
  const [storage, setStorage] = useState<ProfileStorage>({
    used: 0,
    limit: 0,
    remaining: 0,
  });
  const { username } = useParams();
  const { data, status, isLoading, error, fetchData } = useFetch<UserProfileWithFiles>();
  const { setIsModalOpen } = useModalContext();
  const navigate = useNavigate();

  const isOwnProfile = data?.isOwner ?? false;

  useEffect(() => {
    setIsModalOpen(isLoading);
    return () => setIsModalOpen(false);
  }, [isLoading, setIsModalOpen]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        await fetchData(
          `http://localhost:${import.meta.env.VITE_BACKENDPORT}/api/getProfile/${username}`,
          { credentials: "include" }
        );
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchProfileData();
  }, [username, fetchData]);

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

  useEffect(() => {
    if (status === 404) navigate("/NotFound");
  }, [status, navigate]);

  return {
    data,
    error,
    isLoading,
    isOwnProfile,
    usedBytes: storage.used,
    limitBytes: storage.limit,
    remainingBytes: storage.remaining,
  };
};
