import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFetch, useModalContext } from "../../../shared";
import { UserProfileWithFiles } from "../types/profileData"

export const useProfileData = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { data, status, isLoading, error, fetchData } = useFetch<UserProfileWithFiles>();
  const { setIsModalOpen } = useModalContext();

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
          }/api/getProfile/${username}`, {
            credentials: 'include',
          }
        );
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchProfileData();
  }, [username, fetchData]);

  useEffect(() => {
    if (status === 404) {
      navigate("/NotFound");
    }
  }, [status, navigate]);

  return { data, error, isLoading, isOwnProfile };
};
