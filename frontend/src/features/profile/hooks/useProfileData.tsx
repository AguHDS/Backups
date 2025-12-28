import { useEffect } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useModalContext } from "@/shared";
import { getProfile } from "../api/profileApi";
import type { UserProfileWithFiles } from "../types/profileData";

// Returns general profile data, sections and its related data, and isOwnProfile flag
export const useProfileData = () => {
  const params = useParams({ strict: false });
  const username = params.username as string;

  const { setIsModalOpen } = useModalContext();
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    error,
    isError,
  } = useQuery<UserProfileWithFiles, Error>({
    queryKey: ["profile", username],
    queryFn: () => getProfile(username),
    enabled: !!username,
    retry: (failureCount, error) => {
      // Don't retry on 404 errors
      if (error.message.includes("404")) {
        return false;
      }
      return failureCount < 2;
    },
  });

  const isOwnProfile = data?.isOwner ?? false;

  useEffect(() => {
    setIsModalOpen(isLoading);
    return () => setIsModalOpen(false);
  }, [isLoading, setIsModalOpen]);

  useEffect(() => {
    if (isError && error?.message.includes("404")) {
      navigate({ to: "/NotFound" });
    }
  }, [isError, error, navigate]);

  return {
    data,
    error,
    isLoading,
    isOwnProfile,
  };
};