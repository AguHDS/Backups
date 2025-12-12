import { useRef, memo, useCallback, useMemo } from "react";
import { UploadedFile } from "../types/section";
import { CloudinaryImage } from "@/services/Cloudinary";

interface Props {
  uploadedFiles: UploadedFile[];
  sectionId: number | string;
  isEditing?: boolean;
  selectedFileIds?: Set<string>;
  toggleFileSelection?: (fileId: string) => void;
}

// Constant empty Set to avoid creating new instance on each render
const EMPTY_SET = new Set<string>();
const NOOP = () => {};

// Custom comparison function for memo
const arePropsEqual = (prevProps: Props, nextProps: Props) => {
  // Check if arrays have same length and same items
  if (prevProps.uploadedFiles.length !== nextProps.uploadedFiles.length) {
    return false;
  }
  
  // Check if all publicIds are the same
  for (let i = 0; i < prevProps.uploadedFiles.length; i++) {
    if (prevProps.uploadedFiles[i].publicId !== nextProps.uploadedFiles[i].publicId) {
      return false;
    }
  }
  
  // Check other props
  return (
    prevProps.sectionId === nextProps.sectionId &&
    prevProps.isEditing === nextProps.isEditing &&
    prevProps.selectedFileIds === nextProps.selectedFileIds &&
    prevProps.toggleFileSelection === nextProps.toggleFileSelection
  );
};

// Renders the file gallery inside a section
export const SectionFileGallery = memo(({
  uploadedFiles,
  sectionId,
  isEditing = false,
  selectedFileIds = EMPTY_SET,
  toggleFileSelection = NOOP,
}: Props) => {
  // filter files without a valid publicId (can't be displayed or interacted with)
  const validFiles = useMemo(
    () => uploadedFiles.filter((file) => !!file.publicId),
    [uploadedFiles]
  );
  
  const lastSelectedIndexRef = useRef<number | null>(null);

  const handleClick = useCallback((
    fileId: string,
    index: number,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    if (!isEditing) return;

    // handle multi selection with shift key
    if (e.shiftKey && lastSelectedIndexRef.current !== null) {
      const start = Math.min(lastSelectedIndexRef.current, index);
      const end = Math.max(lastSelectedIndexRef.current, index);

      for (let i = start; i <= end; i++) {
        toggleFileSelection(validFiles[i].publicId!);
      }
    } else {
      // single file selection
      toggleFileSelection(fileId);
    }

    lastSelectedIndexRef.current = index + 1;
  }, [isEditing, toggleFileSelection, validFiles]);

  return (
    <div className="p-4 overflow-y-auto border border-[#121212] bg-[#1e1e1e] h-[50vh] max-h-[50vh] min-w-[90%] max-w-[90%]">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {validFiles.length > 0 ? (
          validFiles.map((file, i) => {
            const fileId = file.publicId!; // use publicId as stable identifier
            const isSelected = selectedFileIds.has(fileId);

            return (
              <div
                key={fileId}
                className={`relative w-full aspect-square cursor-pointer ${
                  isEditing && isSelected ? "ring-4 ring-blue-500" : ""
                }`}
                onClick={(e) => handleClick(fileId, i, e)}
              >
                {isEditing && (
                  <input
                    type="checkbox"
                    id={fileId}
                    className="absolute top-2 left-2 z-10 w-4 h-4 pointer-events-none"
                    checked={isSelected}
                    readOnly
                  />
                )}
                <CloudinaryImage
                  publicId={fileId}
                  alt={`Uploaded file ${i + 1}`}
                  className="object-cover w-full h-full rounded"
                  width={400}
                  height={400}
                />
              </div>
            );
          })
        ) : (
          <div className="text-[#999]">No files uploaded for this section</div>
        )}
      </div>
    </div>
  );
}, arePropsEqual);
