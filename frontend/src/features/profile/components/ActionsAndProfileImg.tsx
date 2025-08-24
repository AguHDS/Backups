import { Link } from "react-router-dom";

interface Props {
  profilePic: string;
  giftIcon: string;
  msgIcon: string;
  addPartnerIcon: string;
}

export const ActionsAndProfileImg = ({ profilePic, giftIcon, msgIcon, addPartnerIcon }: Props) => {
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
          title="Give a gift"
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
          title="Add partner"
          className="h-[30px] mx-[2px] w-[45px] flex items-center justify-center"
        >
          <img
            src={addPartnerIcon}
            className="h-6 w-7 object-contain"
            alt="Add partner"
          />
        </span>
      </div>
    </>
  );
};
