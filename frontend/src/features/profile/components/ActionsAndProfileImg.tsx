import { useRef } from "react";
import { CloudinaryImage } from "@/services/Cloudinary/CloudinaryImage";
import { images } from "@/assets/images";

interface Props {
  profilePic: string; // public_id from Cloudinary
  previewUrl: string | null;
  isEditing: boolean;
  onSelectImage: (file: File) => void;
  refreshKey?: number;
}

export const ActionsAndProfileImg = ({
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

  // Show preview if available, otherwise show Cloudinary image or fallback
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
};