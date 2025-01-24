export const Bio = ({bio, isEditing, onBioChange}) => {
  return (
    <>
      {isEditing ? (
        <textarea
          className="w-[95%] bg-[#272727] text-[#ccc] text-[14px] p-2 mb-4 border border-[#444] resize-none"
          rows="3"
          placeholder="Add a new biography"
          value={bio}
          onChange={(e) => onBioChange(e.target.value)}
        ></textarea>
      ) : (
        <div className="flex items-center h-12 text-gray-200">
          {bio}
        </div>
      )}
    </>
  );
};