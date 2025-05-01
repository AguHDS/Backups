import { Button } from "../../../shared";

export const AccountSettings = () => {
  return (
    <div className="mx-auto flex justify-center max-w-full bg-black h-screen">
      <div className="w-[60%] h-[80%] bg-gray-700 rounded-lg shadow-lg mx-auto my-auto">
        <div className="justify-center space-x-4 p-4 flex flex-wrap sm:flex-nowrap">
          <Button
            label="Profile"
            className="oldgrayBtn"
            id="profile-button"
          ></Button>
          <Button
            label="Account settings"
            className="oldgrayBtn"
            id="livechat-button"
          ></Button>
          <Button
            label="My files"
            className="oldgrayBtn"
            id="myfiles-button"
          ></Button>
        </div>
        <div className="w-full flex justify-center bg-gray-700">
          <div className="flex-grow flex justify-center text-center text-gray-300 h-full p-4">
            Click on the buttons to choose a configuration
          </div>
        </div>
      </div>
    </div>
  );
};
