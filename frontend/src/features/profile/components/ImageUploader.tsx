import React, { useEffect, useRef, useState } from "react";
import { Button } from "../../../shared";
import { useProfile } from "../context/ProfileContext";
/* import { Image } from "cloudinary-react"; */

export const ImageUploader = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isEditing, isOwnProfile } = useProfile();
  const [files, setFiles] = useState<File[]>([]);
  const [readyToUpload, setReadyToUpload] = useState<boolean>(false);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  //set state with selected files
  const handleUploadFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setFiles((prevFiles) => [...prevFiles, ...Array.from(selectedFiles)]);
    setReadyToUpload(true);
  };

  const cancelUpload = () => {
    setFiles([]);
    setReadyToUpload(false);
  };

  //send files to backend
  const handleSendFiles = async () => {
    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));

    try {
      const response = await fetch(
        `http://localhost:${import.meta.env.VITE_BACKENDPORT}/api/uploadFiles`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Error uploading files, ${error}`);
      }

      const data = await response.json();
      console.log("Data recibida desde el basckend: ", data);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`An error ocurred. ${error.message}`);
      }
    }
  };

  useEffect(() => {
    console.log(files);
  }, [files]);

  return (
    <div className="flex flex-col items-center">
      {/* Main container for images */}
      <div className="p-4 overflow-y-auto border border-[#121212] bg-[#1e1e1e] h-[50vh] max-h-[50vh] min-w-[90%] max-w-[90%]">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {[...Array(11)].map((_, index) => (
            <div
              key={`imagen1-${index}`}
              className="w-full h-[150px] bg-[#444] flex items-center justify-center text-[#ccc]"
            >
              imagen {index + 1}
            </div>
          ))}
        </div>
      </div>
      {!isEditing && isOwnProfile && (
        <div className="flex flex-col items-center mt-4">
          {!readyToUpload ? (
            <Button
              label="Select new files"
              className="my-2 mb-5 p-2 text-center w-[12vw] bg-[#303030] text-[#ccc] border border-[#444] hover:bg-[#333]"
              onClick={handleButtonClick}
            ></Button>
          ) : (
            <>
              <div className="mt-4 text-center text-[#ccc]">
                Selected files:
                <span className="ml-2 text-green-400">{files.length}</span>
              </div>
              <div className="flex justify-center space-x-4">
                <Button
                  label="Add files"
                  className="my-1 mb-5 mt-5 p-2 text-center w-[12vw] bg-[#303030] text-[#ccc] border border-[#444] hover:bg-[#333]"
                  onClick={handleSendFiles}
                ></Button>
                <Button
                  label="Cancel"
                  className="my-1 mb-5 mt-5 p-2 text-center w-[12vw] bg-[#303030] text-[#ccc] border border-[#444] hover:bg-[#333]"
                  onClick={cancelUpload}
                ></Button>
              </div>
            </>
          )}
          <input
            className="hidden"
            type="file"
            ref={fileInputRef}
            onChange={handleUploadFiles}
            multiple
            aria-label="Upload files"
            aria-hidden="true"
            title="Select files to upload"
          />
        </div>
      )}
    </div>
  );
};
