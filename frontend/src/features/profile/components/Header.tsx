import { Button } from "../../../shared/components";
import { useProfile } from "../context/ProfileContext";

interface Props {
  username: string;
  onCancel?: () => void;
}

export const Header = ({ username, onCancel }: Props) => {
  const { isEditing, setIsEditing, isOwnProfile } = useProfile();

  return (
    <div className="w-full">
      <h1 className="...">
        <span className="...">{username}&apos;s profile</span>
        {isOwnProfile && (
          <Button
            label={isEditing ? "Cancel" : "Edit profile"}
            className="..."
            onClick={() => {
              if (isEditing && onCancel) onCancel();
              else setIsEditing(true);
            }}
          />
        )}
      </h1>
    </div>
  );
};
