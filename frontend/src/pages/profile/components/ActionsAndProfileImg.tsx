import { Link } from "react-router-dom";

export const ActionsAndProfileImg = ({
  profilePic,
  giftIcon,
  msgIcon,
  addFriendIcon,
}) => {
  return (
    <>
      <div className="block text-center">
        <img
          className="max-h-[350px] max-w-full"
          src={profilePic}
          alt="Profile"
        />
      </div>
      <div className="flex justify-center items-center mt-2">
        <Link
          to="/dashboard"
          title="Share GB"
          className="h-[30px] mx-[2px] w-[45px] flex items-center justify-center"
        >
          <img src={giftIcon} className="h-6 w-7 object-contain" alt="Gift" />
        </Link>
        <Link
          to="/"
          title="Send message"
          className="h-[30px] mx-[2px] w-[45px] flex items-center justify-center"
        >
          <img src={msgIcon} className="h-6 w-7 object-contain" alt="Message" />
        </Link>
        <span
          title="Add friend"
          className="h-[30px] mx-[2px] w-[45px] flex items-center justify-center"
        >
          <img
            src={addFriendIcon}
            className="h-6 w-7 object-contain"
            alt="Add Friend"
          />
        </span>
      </div>
    </>
  );
};
