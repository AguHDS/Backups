import { Button } from "../../../shared/components";
import { useProfile } from "../context/profile/profileContext";

interface Props {
  username: string;
  onSave: () => void;
  onCancel?: () => void;
}

export const Header = ({ username, onSave, onCancel }: Props) => {
  const { isEditing, setIsEditing, isOwnProfile } = useProfile();

  return (
    <div className="w-full">
      <h1 className="bg-[#222] border font-serif border-t-[#222] border-b-[#585858] border-l-[#272727] border-r-[#272727] text-[#e0e0e0] font-verdana font-bold text-sm m-0 p-[5px_9px] text-left flex items-center justify-between">
        <span className="flex ml-[50px] relative top-[2px] text-base">
          {username}&apos;s profile
        </span>

        {isOwnProfile && (
          <div className="flex gap-2 mr-1 mt-1">
            {isEditing && (
              <Button
                label="Save"
                className="text-blue-500 text-sm hover:underline cursor-pointer bg-transparent border-none shadow-none"
                onClick={onSave}
              />
            )}
            <Button
              label={isEditing ? "Cancel" : "Edit profile"}
              className="text-blue-500 text-sm hover:underline cursor-pointer bg-transparent border-none shadow-none"
              onClick={() => {
                if (isEditing) {
                  onCancel?.();
                } else {
                  setIsEditing(true);
                }
              }}
            />
          </div>
        )}
      </h1>
    </div>
  );
};
