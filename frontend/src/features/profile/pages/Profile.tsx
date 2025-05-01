import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Modal, LoadingSpinner, useModalContext, useFetch } from "../../../shared";
import { RootState } from "../../../app/redux/store";
import { ProfileProvider } from "../context/ProfileContext";
import {images} from "../../../assets/images";
import {
  Header,
  ActionsAndProfileImg,
  Graph,
  UserInfo,
  Storage,
  ProfileContent,
} from "../components";

interface ProfileStats {
  bio: string;
  profile_pic?: string;
  partner: string;
  friends: number;
}

interface ProfileSection {
  title: string;
  description: string;
}

interface CustomResponse {
  username: string;
  role: string;
  id: number;
  userProfileData: ProfileStats;
  userSectionData: ProfileSection;
}

export const Profile = () => {
  const { data, status, isLoading, error, fetchData } = useFetch<CustomResponse>();
  const { isAuthenticated, userData } = useSelector((state: RootState) => state.auth);
  const { username } = useParams();
  const { setIsModalOpen } = useModalContext();
  const navigate = useNavigate();

  //loading spinner
  useEffect(() => {
    setIsModalOpen(isLoading);

    return () => {
      setIsModalOpen(false);
    };
  }, [isLoading, setIsModalOpen]);

  const isOwnProfile = !!(isAuthenticated && data && userData.id === data.id);

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

  return (
    <ProfileProvider isOwnProfile={isOwnProfile}>
      {isLoading && (
        <Modal>
          <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner size="lg" />
          </div>
        </Modal>
      )}

      {!isLoading && !data && error && (
        <div className="flex justify-center items-center h-screen">
          <p className="text-red-500">Error loading profile.</p>
        </div>
      )}

      {/* Profile begins here */}
      {!isLoading && data && (
        <div className="mx-auto flex justify-center mt-5">
          <div className="w-[80vw] max-w-full">
            <Header
              username={data.username}
            />
            <div className="p-[8px] bg-[#121212] border-[#272727] border-solid border-r border-b text-[#e0e0e0]">
              <div className="flex flex-col md:flex-row w-full">
                {/* left area */}
                <div className="bg-[#272727] p-2 flex-shrink-0 w-full md:w-[225px]">
                  <ActionsAndProfileImg
                    profilePic={images.testImage}
                    giftIcon={images.giftIcon}
                    msgIcon={images.msgIcon}
                    addFriendIcon={images.addFriend}
                  />
                  <UserInfo
                    userStatus={"offline"}
                    role={data.role}
                    friendsCounter={data.userProfileData.friends}
                    partner={data.userProfileData.partner}
                  />

                  <h3 className="text-center my-5">Storage</h3>
                  <Graph graphTestImage={images.graph} />
                  <Storage
                    maxSpace="6 GB"
                    available="2 GB"
                    used="3 GB"
                    shared="1 GB"
                  />
                </div>
                {/* right area */}
                <ProfileContent
                  bio={data.userProfileData.bio}
                  title={data.userSectionData.title}
                  description={data.userSectionData.description}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </ProfileProvider>
  );
};
