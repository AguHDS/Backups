import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/shared";
import {
  useEditProfile,
  useSection,
  useSections,
} from "../context";
import { useParams } from "@tanstack/react-router";
import { SectionFileGallery } from "./SectionFileGallery";
import { useFileDeletion } from "../context";
import { processErrorMessages } from "@/shared/utils/processErrorMessages";
import { ValidationMessages } from "@/shared";
import { useUploadFiles } from "../hooks/useProfileMutations";
import { useInvalidateDashboard } from "@/features/dashboard/hooks/useDashboard";

interface Props {
  sectionIndex: number;
}

export const SectionFileManager = ({ sectionIndex }: Props) => {
  const [files, setFiles] = useState<File[]>([]);
  const [readyToUpload, setReadyToUpload] = useState(false);
  const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(
    new Set()
  );
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [hiddenFileIds, setHiddenFileIds] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isEditing, isOwnProfile } = useEditProfile();
  const { renderFilesOnResponse } = useSections();
  const { addFilesToDelete } = useFileDeletion();
  const invalidateDashboard = useInvalidateDashboard();
  const { username } = useParams({ from: "/profile/$username" });

  // Mutation for uploading files
  const uploadFilesMutation = useUploadFiles();

  // Use specific section hook to avoid re-renders when other sections change
  const section = useSection(sectionIndex);
  const sectionId = section.id;
  const sectionTitle = section.title;
  const uploadedFiles = useMemo(() => section.files || [], [section.files]);

  const handleButtonClick = () => fileInputRef.current?.click();

  useEffect(() => {
    if (uploadFilesMutation.isSuccess && uploadFilesMutation.data) {
      renderFilesOnResponse(sectionId, uploadFilesMutation.data.files);
      setFiles([]);
      setReadyToUpload(false);
      setUploadErrors([]);
      invalidateDashboard();
    } else if (uploadFilesMutation.isError) {
      const messages = processErrorMessages(uploadFilesMutation.error);
      console.error("Upload error details:", {
        messages,
        error: uploadFilesMutation.error,
      });
      setUploadErrors(messages);
    }
  }, [
    uploadFilesMutation.isSuccess,
    uploadFilesMutation.isError,
    uploadFilesMutation.data,
    uploadFilesMutation.error,
    sectionId,
    renderFilesOnResponse,
    invalidateDashboard,
  ]);

  // Handle selecting files from input
  const handleUploadFiles = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files;
      if (!selected || selected.length === 0) return;

      uploadFilesMutation.reset();
      setUploadErrors([]);

      setFiles((prev) => [...prev, ...Array.from(selected)]);
      setReadyToUpload(true);
    },
    [uploadFilesMutation]
  );

  const cancelUpload = () => {
    setFiles([]);
    setReadyToUpload(false);
    setUploadErrors([]);
    uploadFilesMutation.reset();
  };

  // Toggle selection checkbox for files (add/remove from set)
  const toggleFileSelection = useCallback((fileId: string) => {
    setSelectedFileIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  }, []);

  // Upload files
  const handleSendFiles = useCallback(async () => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    uploadFilesMutation.mutate({
      username,
      sectionId,
      sectionTitle,
      formData,
    });
  }, [files, uploadFilesMutation, username, sectionId, sectionTitle]);

  const handleDeleteSelectedFiles = useCallback(() => {
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
  }, [selectedFileIds, uploadedFiles, addFilesToDelete, sectionId]);

  const visibleFiles = useMemo(
    () => uploadedFiles.filter((file) => !hiddenFileIds.has(file.publicId)),
    [uploadedFiles, hiddenFileIds]
  );

  const hasErrorsToShow =
    uploadErrors.length > 0 || uploadFilesMutation.isError;

  return (
    <div className="flex flex-col items-center w-full">
      {/* Display files inside sections */}
      <SectionFileGallery
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
              {hasErrorsToShow && (
                <div className="w-full max-w-[80%] mt-4">
                  <ValidationMessages
                    input={
                      uploadErrors.length > 0
                        ? uploadErrors
                        : [
                            uploadFilesMutation.error?.message ||
                              "Upload failed",
                          ]
                    }
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
