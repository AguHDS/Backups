import { useRef } from "react";
import { UploadedFile } from "../types/section";

interface Props {
  uploadedFiles: UploadedFile[];
  sectionId: number | string;
  isEditing?: boolean;
  selectedFileIds?: Set<string>;
  toggleFileSelection?: (fileId: string) => void;
}

// Renders the file gallery inside a section
export const SectionFileGallery = ({
  uploadedFiles,
  sectionId,
  isEditing = false,
  selectedFileIds = new Set(),
  toggleFileSelection = () => {},
}: Props) => {
  // filter files without a valid publicId (can't be displayed or interacted with)
  const validFiles = uploadedFiles.filter((file) => !!file.publicId);
  const lastSelectedIndexRef = useRef<number | null>(null);

  const handleClick = (fileId: string, index: number, e: React.MouseEvent<HTMLDivElement>) => {
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
  };

  return (
    <div className="p-4 overflow-y-auto border border-[#121212] bg-[#1e1e1e] h-[50vh] max-h-[50vh] min-w-[90%] max-w-[90%]">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {validFiles.length > 0 ? (
          validFiles.map((file, i) => {
            const fileId = file.publicId!; // use publicId as stable identifier
            const uniqueKey = `${sectionId}-${fileId}`;  // unique key for react rendering key
            const isSelected = selectedFileIds.has(fileId);

            return (
              <div
                key={uniqueKey}
                className={`relative w-full h-[150px] cursor-pointer ${
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
                <img
                  src={file.url}
                  alt={`Uploaded file ${i + 1}`}
                  className="object-cover w-full h-full rounded"
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
