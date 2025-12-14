interface Props {
  profilePic: string;
}

export const ActionsAndProfileImg = ({ profilePic }: Props) => {
  return (
    <>
      <div className="block text-center">
        <img
          className="max-h-[350px] max-w-full"
          src={profilePic}
          alt="Profile"
        />
      </div>
    </>
  );
};
