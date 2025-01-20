import { Button } from "../../../components";

export const Header = ({ isOwnProfile, username, isEditing, setIsEditing }) => {
  return (
    <div className="w-full">
      <h1 className="bg-[#222] border font-serif border-t-[#222] border-b-[#585858] border-l-[#272727] border-r-[#272727] text-[#e0e0e0] font-verdana font-bold text-sm m-0 p-[5px_9px] text-left flex items-center justify-between">
        <span className="flex ml-[50px] relative top-[2px] text-base">
          {username}'s profile
        </span>
        {isOwnProfile && (
          <Button
            label={isEditing ? "Cancel" : "Edit profile"}
            className="text-blue-500 text-sm hover:underline mr-1 mt-1 cursor-pointer bg-transparent border-none shadow-none"
            onClick={()=> setIsEditing(!isEditing)}
          ></Button>
        )}
      </h1>
    </div>
  );
};
