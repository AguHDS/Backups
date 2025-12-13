import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFetch, useModalContext } from "@/shared";
import { UserProfileWithFiles } from "../types/profileData";

// Returns general profile data, sections and its related data, and isOwnProfile flag
export const useProfileData = () => {
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
    if (status === 404) navigate("/NotFound");
  }, [status, navigate]);

  return {
    data,
    error,
    isLoading,
    isOwnProfile,
  };
};
