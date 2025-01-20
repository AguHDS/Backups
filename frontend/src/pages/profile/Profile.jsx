import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

//components
import {
  Header,
  ActionsAndProfileImg,
  Graph,
  UserInfo,
  Storage,
  ProfileContent,
} from "./components";
import { Modal, LoadingSpinner } from "../../components";

//context
import { useModalContext } from "../../components/Modal/context/ModalContext.jsx";

//redux
import { useSelector } from "react-redux";

//custom hooks
import useFetch from "../../hooks/useFetch";

//assets
import images from "../../assets/images.js";

export const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { data, status, isLoading, error, fetchData } = useFetch();
  const { isAuthenticated, userData } = useSelector((state) => state.auth);
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

  const isOwnProfile = isAuthenticated && userData.id === data?.userData.id;

  //get profile data from database
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        await fetchData(
          `http://localhost:${
            import.meta.env.VITE_BACKENDPORT
          }/api/getProfile/${username}`
        );
      } catch (err) {
        console.error("Error fetching profile data:", err);
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
    <>
      {isLoading && (
        <Modal>
          <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner size="lg" />
          </div>
        </Modal>
      )}

      {!isLoading && !data?.userData && error && (
        <div className="flex justify-center items-center h-screen">
          <p className="text-red-500">Error loading profile.</p>
        </div>
      )}

      {/* Profile begins here */}
      {!isLoading && data?.userData && (
        <div className="mx-auto flex justify-center mt-5">
          <div className="w-[80vw] max-w-full">
            <Header
              isOwnProfile={isOwnProfile}
              username={data.userData.username}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
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
                    role={data.userData.role}
                    friendsCounter={data.userData.friends}
                    partner={data.userData.partner}
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
                  isEditing={isEditing}
                  bio={data.userData.bio}
                  title={data.userData.sections.title}
                  description={data.userData.sections.description}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
