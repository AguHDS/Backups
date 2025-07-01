import { UploadedFile } from "../types/section";

interface Props {
  uploadedFiles: UploadedFile[];
  sectionId: number | string;
  isEditing?: boolean;
  selectedFileIds?: Set<string>;
  toggleFileSelection?: (fileId: string) => void;
}

// Current files shown in section
export const SectionFileGallery = ({
  uploadedFiles,
  sectionId,
  isEditing = false,
  selectedFileIds = new Set(),
  toggleFileSelection = () => {},
}: Props) => {
  return (
    <div className="p-4 overflow-y-auto border border-[#121212] bg-[#1e1e1e] h-[50vh] max-h-[50vh] min-w-[90%] max-w-[90%]">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {uploadedFiles.length > 0 ? (
          uploadedFiles.map((file, i) => {
            const fileId = file.publicId ?? `temp-${i}`;
            const uniqueKey = `${sectionId}-${fileId}`;

            return (
              <div key={uniqueKey} className="relative w-full h-[150px]">
                {isEditing && (
                  <input
                    type="checkbox"
                    id={`checkbox-${uniqueKey}`}
                    name={`file-checkbox-${uniqueKey}`}
                    value={fileId}
                    className="absolute top-2 left-2 z-10 w-4 h-4"
                    checked={selectedFileIds.has(fileId)}
                    onChange={() => toggleFileSelection(fileId)}
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
    </div>//las imagenes ya se eliminan e la vista ahora falta hacerelfethcjh paa eliminar las imagenes selccionadas desde el onSave del Header
  );
};
