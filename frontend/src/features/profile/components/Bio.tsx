import { useEditProfile } from "../context/editProfile/editProfileContext";

interface Props {
  bio: string;
  onBioChange: (bio: string) => void;
}

export const Bio = ({ bio, onBioChange }: Props) => {
  const { isEditing } = useEditProfile();

  return (
    <>
      <div className="w-full">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-gray-400 text-[17px] ml-2 mb-1 font-sans">Bio</h2>
        </div>
      </div>

      <div className="max-w-full bg-[#1e1e1e] border border-[#333] shadow-md p-3 overflow-hidden">
        {isEditing ? (
          <textarea
            className="w-full box-border bg-transparent text-gray-300 text-[16px] leading-normal font-sans p-2 border border-[#444] resize-none"
            rows={3}
            placeholder="Add a new biography"
            value={bio}
            onChange={(e) => onBioChange(e.target.value)}
            maxLength={500}
          />
        ) : (
          <p className="text-gray-300 text-[16px] leading-normal font-sans ml-2 my-0 break-words whitespace-pre-wrap overflow-hidden word-break-break-word">
            {bio}
          </p>
        )}
      </div>

      {isEditing && (
        <div className="text-right mr-2">
          <span
            className={`text-xs font-sans ${bio.length >= 450 ? "text-amber-400" : "text-gray-400"}`}
          >
            {bio.length}/500
          </span>
        </div>
      )}
    </>
  );
};
