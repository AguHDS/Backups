import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useFetch, useModalContext } from "../../../shared";
import { RootState } from "../../../app/redux/store";

interface ProfileStats {
  bio: string;
  profile_pic?: string;
  partner: string;
  friends: number;
}

interface ProfileSection {
  id: number;
  title: string;
  description: string;
}

interface UserProfile {
  username: string;
  role: string;
  id: number;
  userProfileData: ProfileStats;
  userSectionData: ProfileSection[];
}

export const useProfileData = () => {
  const { isAuthenticated, userData } = useSelector(
    (state: RootState) => state.auth
  );
  const { username } = useParams();
  const navigate = useNavigate();
  const { data, status, isLoading, error, fetchData } = useFetch<UserProfile>();
  const { setIsModalOpen } = useModalContext();

  //check if the profile belongs to the authenticated user
  const isOwnProfile = !!(isAuthenticated && data && userData.id === data.id);

  //spinner (loading)
  useEffect(() => {
    setIsModalOpen(isLoading);

    return () => {
      setIsModalOpen(false);
    };
  }, [isLoading, setIsModalOpen]);

  //get profile data from database
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        await fetchData(
          `http://localhost:${
            import.meta.env.VITE_BACKENDPORT
          }/api/getProfile/${username}`
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
