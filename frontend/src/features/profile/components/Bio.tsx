import { useProfile } from "../context/Profile/profileContext";

interface Props {
  bio: string;
  onBioChange: (bio: string) => void;
}

export const Bio = ({ bio, onBioChange }: Props) => {
  const { isEditing } = useProfile();

  return (
    <>
      {isEditing ? (
        <>
          <div className="w-full mt-6">
            <h2 className="text-green-500 text-lg ml-2 mb-1 font-medium">
              Biography
            </h2>
          </div>
          <textarea
            className="w-[95%] bg-[#272727] text-[#ccc] text-[14px] p-2 mb-4 border border-[#444] resize-none"
            rows={3}
            placeholder="Add a new biography"
            value={bio}
            onChange={(e) => onBioChange(e.target.value)}
          ></textarea>
        </>
      ) : (
        <div className="w-full mt-6">
          <h2 className="text-green-400 text-lg ml-2 mb-1 font-medium">Biography</h2>
          <div className="max-w-full bg-[#1e1e1e] border border-[#333] rounded-xl shadow-md p-3">
            <p className="text-[18px] text-gray-300 ml-2 my-0">{bio}</p>
          </div>
        </div>
      )}
    </>
  );
};
