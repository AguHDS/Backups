import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFetch, useModalContext } from "../../../shared";
import { UserProfileWithFiles } from "../types/profileData";

export const useProfileData = (refreshTrigger?: boolean) => {
  const [usedBytes, setUsedBytes] = useState<number>(0);
  const { username } = useParams();
  const { data, status, isLoading, error, fetchData } = useFetch<UserProfileWithFiles>();
  const { setIsModalOpen } = useModalContext();
  const navigate = useNavigate();

  // Check if the profile belongs to the authenticated user
  const isOwnProfile = data?.isOwner ?? false;

  // Spinner (loading)
  useEffect(() => {
    setIsModalOpen(isLoading);

    return () => {
      setIsModalOpen(false);
    };
  }, [isLoading, setIsModalOpen]);

  // Get profile data from database
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        await fetchData(
          `http://localhost:${
            import.meta.env.VITE_BACKENDPORT
          }/api/getProfile/${username}`,
          {
            credentials: "include",
          }
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
          `http://localhost:${
            import.meta.env.VITE_BACKENDPORT
          }/api/getStorage/${username}`
        );
        if (!res.ok) throw new Error("Failed to fetch profile storage");
        const data = await res.json();
        setUsedBytes(data.used);
      } catch (err) {
        console.error("Error fetching profile storage:", err);
      }
    };

    fetchStorage();
  }, [username, refreshTrigger]);

  useEffect(() => {
    if (status === 404) {
      navigate("/NotFound");
    }
  }, [status, navigate]);

  return { data, error, isLoading, isOwnProfile, usedBytes };
};
