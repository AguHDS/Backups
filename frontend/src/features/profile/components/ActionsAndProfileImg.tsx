import { memo, useRef } from "react";
import { CloudinaryImage } from "@/services/Cloudinary/CloudinaryImage";
import { images } from "@/assets/images";

interface Props {
  profilePic: string;
  previewUrl: string | null;
  isEditing: boolean;
  onSelectImage: (file: File) => void;
  refreshKey?: number;
}

const arePropsEqual = (prevProps: Props, nextProps: Props) => {
  return (
    prevProps.profilePic === nextProps.profilePic &&
    prevProps.previewUrl === nextProps.previewUrl &&
    prevProps.isEditing === nextProps.isEditing &&
    prevProps.refreshKey === nextProps.refreshKey &&
    prevProps.onSelectImage === nextProps.onSelectImage
  );
};

export const ActionsAndProfileImg = memo(
  ({
    profilePic,
    previewUrl,
    isEditing,
    onSelectImage,
    refreshKey = 0,
  }: Props) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleImageClick = () => {
      if (isEditing) {
        inputRef.current?.click();
      }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onSelectImage(file);
      }
    };

    const showPreview = previewUrl !== null;
    const showCloudinaryImage = !showPreview && profilePic;
    const showFallback = !showPreview && !profilePic;

    return (
      <div className="block text-center">
        {showPreview && (
          <img
            src={previewUrl}
            alt="Profile preview"
            onClick={handleImageClick}
            className={`mx-auto max-h-[350px] max-w-full rounded-lg ${
              isEditing ? "cursor-pointer opacity-80 hover:opacity-100" : ""
            }`}
          />
        )}

        {showCloudinaryImage && (
          <CloudinaryImage
            publicId={profilePic}
            alt="Profile"
            size={350}
            onClick={handleImageClick}
            className={`mx-auto rounded-lg max-w-full ${
              isEditing ? "cursor-pointer opacity-80 hover:opacity-100" : ""
            }`}
            cacheBust={refreshKey}
          />
        )}

        {showFallback && (
          <img
            src={images.testImage}
            alt="Default profile"
            onClick={handleImageClick}
            className={`mx-auto max-h-[350px] max-w-full rounded-lg ${
              isEditing ? "cursor-pointer opacity-80 hover:opacity-100" : ""
            }`}
          />
        )}

        {isEditing && (
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        )}
      </div>
    );
  },
  arePropsEqual
);

ActionsAndProfileImg.displayName = "ActionsAndProfileImg";
