import React, { useRef, useState } from "react";
import { Button } from "../../../shared";
import { useProfile, useSections, useStorageRefresh } from "../context";
import { useParams } from "react-router-dom";
import { UploadedFile } from "../types/section";
import { SectionFileGallery } from "./SectionFileGallery";
import { useFileDeletion } from "../context";
import { processErrorMessages } from "../../../shared/utils/errors";
import { FeedbackMessages } from "../../../shared";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../app/redux/store";
import { getDashboardSummary } from "../../../app/redux/features/thunks/dashboardThunk";

interface Props {
  sectionIndex: number;
}

interface FileUploadResponse {
  files: UploadedFile[];
}

export const SectionFileManager = ({ sectionIndex }: Props) => {
  const [files, setFiles] = useState<File[]>([]);
  const [readyToUpload, setReadyToUpload] = useState(false);
  const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(new Set());
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [hiddenFileIds, setHiddenFileIds] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isEditing, isOwnProfile } = useProfile();
  const { sections, renderFilesOnResponse } = useSections();
  const { refresh: refreshStorage } = useStorageRefresh();
  const { addFilesToDelete } = useFileDeletion();
  const dispatch = useDispatch<AppDispatch>();
  const { username } = useParams();

  const section = sections[sectionIndex];
  const { id: sectionId, title: sectionTitle, files: uploadedFiles = [] } = section;
  const handleButtonClick = () => fileInputRef.current?.click();

  // Handle selecting files from input
  const handleUploadFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected || selected.length === 0) return;

    setFiles((prev) => [...prev, ...Array.from(selected)]);
    setUploadErrors([]);
    setReadyToUpload(true);
  };

  const cancelUpload = () => {
    setFiles([]);
    setReadyToUpload(false);
    setUploadErrors([]);
  };

  // Toggle selection checkbox for files (add/remove from set)
  const toggleFileSelection = (fileId: string) => {
    setSelectedFileIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(fileId) ? newSet.delete(fileId) : newSet.add(fileId);
      return newSet;
    });
  };

  // Upload files to backend
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
        let errorPayload: any;
        try {
          errorPayload = await response.json();
        } catch {
          errorPayload = await response.text();
        }
        throw errorPayload;
      }

      const data: FileUploadResponse = await response.json();
      renderFilesOnResponse(sectionId, data.files);
      setFiles([]);
      setReadyToUpload(false);
      setUploadErrors([]);
      // refresh storage stats from profile and dashboard
      refreshStorage();
      await dispatch(getDashboardSummary());
    } catch (error) {
      const messages = processErrorMessages(error);
      console.error("Upload error:", messages);
      setUploadErrors(messages);
    }
  };

  const handleDeleteSelectedFiles = () => {
    if (selectedFileIds.size === 0) return;

    // Only include valid file publicIds
    const idsToDelete = Array.from(selectedFileIds).filter((id) =>
      uploadedFiles.some((file) => file.publicId === id)
    );

    if (idsToDelete.length === 0) {
      alert("No valid images selected for deletion.");
      return;
    }

    // Hide deleted files from UI
    setHiddenFileIds((prev) => new Set([...prev, ...idsToDelete]));
    // Add to context deletion list
    addFilesToDelete(sectionId, idsToDelete);
    setSelectedFileIds(new Set());
  };

  const visibleFiles = uploadedFiles.filter(
    (file) => !hiddenFileIds.has(file.publicId)
  );

  return (
    <div className="flex flex-col items-center w-full">
      {/* Display files inside sections */}
      <SectionFileGallery
        sectionId={sectionId}
        uploadedFiles={visibleFiles}
        isEditing={isEditing}
        selectedFileIds={selectedFileIds}
        toggleFileSelection={toggleFileSelection}
      />

      {/* Show delete button when files are selected */}
      {isEditing && isOwnProfile && selectedFileIds.size > 0 && (
        <Button
          label="Delete selected images"
          className="mt-4 p-2 w-[200px] text-[#ccc] border border-[#444] bg-[#3a0000] hover:bg-[#550000]"
          onClick={handleDeleteSelectedFiles}
        />
      )}

      {/* Upload file controls */}
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

              {/* Show errors if any */}
              {uploadErrors.length > 0 && (
                <div className="w-full max-w-[80%]">
                  <FeedbackMessages
                    input={uploadErrors}
                    status={null}
                    message={null}
                  />
                </div>
              )}
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
