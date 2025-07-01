import React, { useRef, useState } from "react";
import { Button } from "../../../shared";
import { useProfile } from "../context/ProfileContext";
import { useParams } from "react-router-dom";
import { useSections } from "../context/SectionsContext";
import { UploadedFile } from "../types/section";
import { SectionFileGallery } from "./SectionFileGallery";

interface Props {
  sectionIndex: number;
}

interface FileUploadResponse {
  files: UploadedFile[];
}

export const SectionFileManager = ({ sectionIndex }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isEditing, isOwnProfile } = useProfile();
  const { username } = useParams();
  const [files, setFiles] = useState<File[]>([]);
  const [readyToUpload, setReadyToUpload] = useState(false);
  const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(new Set());
  const [hiddenFileIds, setHiddenFileIds] = useState<Set<string>>(new Set());

  const { sections, renderFilesOnResponse } = useSections();
  const section = sections[sectionIndex];
  const {
    id: sectionId,
    title: sectionTitle,
    files: uploadedFiles = [],
  } = section;

  const handleButtonClick = () => fileInputRef.current?.click();

  const handleUploadFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected || selected.length === 0) return;

    setFiles((prev) => [...prev, ...Array.from(selected)]);
    setReadyToUpload(true);
  };

  const cancelUpload = () => {
    setFiles([]);
    setReadyToUpload(false);
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFileIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  const handleSendFiles = async () => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const response = await fetch(
        `http://localhost:${
          import.meta.env.VITE_BACKENDPORT
        }/api/uploadFiles/${username}?sectionId=${sectionId}&sectionTitle=${sectionTitle}`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Error uploading files, ${error}`);
      }

      const data: FileUploadResponse = await response.json();
      alert("Files uploaded successfully");

      renderFilesOnResponse(sectionId, data.files);
      setFiles([]);
      setReadyToUpload(false);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`An error occurred. ${error.message}`);
      }
    }
  };

  const handleDeleteSelectedFiles = () => {
    if (selectedFileIds.size === 0) return;
    setHiddenFileIds((prev) => new Set([...prev, ...selectedFileIds]));
    setSelectedFileIds(new Set());
  };

  const visibleFiles = uploadedFiles.filter((file, i) => {
    const fileId = file.publicId ?? `temp-${i}`;
    return !hiddenFileIds.has(fileId);
  });

  return (
    <div className="flex flex-col items-center w-full">
      <SectionFileGallery
        sectionId={sectionId ?? `temp-${sectionIndex}`}
        uploadedFiles={visibleFiles.map((file, i) => ({
          ...file,
          publicId: file.publicId ?? `temp-${i}`,
        }))}
        isEditing={isEditing}
        selectedFileIds={selectedFileIds}
        toggleFileSelection={toggleFileSelection}
      />

      {/* Delete selected files button (local-only for now) */}
      {isEditing && isOwnProfile && selectedFileIds.size > 0 && (
        <Button
          label="Delete selected images"
          className="mt-4 p-2 w-[200px] text-[#ccc] border border-[#444] bg-[#3a0000] hover:bg-[#550000]"
          onClick={handleDeleteSelectedFiles}
        />
      )}

      {/* Upload buttons */}
      {!isEditing && isOwnProfile && (
        <div className="flex flex-col items-center mt-4">
          {!readyToUpload ? (
            <Button
              label="Select new files"
              className="flex justify-center items-center w-[200px] mx-auto my-2 text-center p-2 bg-[#303030] text-[#ccc] border border-[#444] hover:bg-[#333] rounded"
              onClick={handleButtonClick}
            />
          ) : (
            <>
              <div className="mt-4 text-center text-[#ccc]">
                Selected files:
                <span className="ml-2 text-green-400">{files.length}</span>
              </div>
              <div className="flex justify-center space-x-4">
                <Button
                  label="Upload files"
                  className="my-1 mb-5 mt-5 p-2 text-center w-[12vw] bg-[#303030] text-[#ccc] border border-[#444] hover:bg-[#333]"
                  onClick={handleSendFiles}
                />
                <Button
                  label="Cancel"
                  className="my-1 mb-5 mt-5 p-2 text-center w-[12vw] bg-[#303030] text-[#ccc] border border-[#444] hover:bg-[#333]"
                  onClick={cancelUpload}
                />
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
          />
        </div>
      )}
    </div>
  );
};
