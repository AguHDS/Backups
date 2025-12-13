import { useRef, memo, useCallback, useMemo } from "react";
import { UploadedFile } from "../types/section";
import { CloudinaryImage } from "@/services/Cloudinary";

interface Props {
  uploadedFiles: UploadedFile[];
  isEditing?: boolean;
  selectedFileIds?: Set<string>;
  toggleFileSelection?: (fileId: string) => void;
}

// Constant empty Set to avoid creating new instance on each render
const EMPTY_SET = new Set<string>();
const NOOP = () => {};

export const SectionFileGallery = ({
  uploadedFiles,
  isEditing = false,
  selectedFileIds = EMPTY_SET,
  toggleFileSelection = NOOP,
}: Props) => {
  const validFiles = useMemo(
    () => uploadedFiles.filter((file) => !!file.publicId),
    [uploadedFiles]
  );

  const lastSelectedIndexRef = useRef<number | null>(null);

  const handleClick = useCallback(
    (fileId: string, index: number, e: React.MouseEvent<HTMLDivElement>) => {
      if (!isEditing) return;

      if (e.shiftKey && lastSelectedIndexRef.current !== null) {
        const start = Math.min(lastSelectedIndexRef.current, index);
        const end = Math.max(lastSelectedIndexRef.current, index);

        for (let i = start; i <= end; i++) {
          toggleFileSelection(validFiles[i].publicId!);
        }
      } else {
        toggleFileSelection(fileId);
      }

      lastSelectedIndexRef.current = index + 1;
    },
    [isEditing, toggleFileSelection, validFiles]
  );

  return (
    <div className="p-4 overflow-y-auto border border-[#121212] bg-[#1e1e1e] h-[50vh] max-h-[50vh] min-w-[90%] max-w-[90%]">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {validFiles.length > 0 ? (
          validFiles.map((file, i) => {
            const fileId = file.publicId!;
            const isSelected = selectedFileIds.has(fileId);

            return (
              <div
                key={fileId}
                className={`relative aspect-square w-full overflow-hidden rounded cursor-pointer
                  ${isEditing && isSelected ? "ring-4 ring-blue-500" : ""}
                `}
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
                  className="absolute inset-0 w-full h-full object-cover"
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
};
