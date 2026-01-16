import { useRef, useCallback, useMemo, useState, useEffect } from "react";
import type { UploadedFile } from "../types/section";
import { CloudinaryImage } from "@/services/Cloudinary";
import { ImageOverview } from "./ImageOverview";
import { FixedSizeGrid } from "react-window";

interface Props {
  uploadedFiles: UploadedFile[];
  isEditing?: boolean;
  selectedFileIds?: Set<string>;
  toggleFileSelection?: (fileId: string) => void;
}

// Constant empty Set to avoid creating new instance on each render
const EMPTY_SET = new Set<string>();
const NOOP = () => {};

/** Manages display and selection of images inside sections */
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
  const openOverviewRef = useRef<((index: number) => void) | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [gridSize, setGridSize] = useState({ width: 600, height: 400 });

  // Measure container size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();

        setGridSize({
          width: width - 32, // p-4 (16px each side)
          height: height - 32,
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Match Tailwind grid-cols-2 sm:grid-cols-3 md:grid-cols-4
  const gridConfig = useMemo(() => {
    const width = gridSize.width;
    const gap = 12; // gap-3

    let columns = 2;
    if (width >= 768) columns = 4;
    else if (width >= 640) columns = 3;

    const columnWidth = Math.floor((width - gap * (columns - 1)) / columns);

    return {
      columns,
      columnWidth,
      rowHeight: columnWidth,
      gap,
    };
  }, [gridSize.width]);

  // Handle click with shift-selection support
  const handleClick = useCallback(
    (fileId: string, index: number, e: React.MouseEvent<HTMLDivElement>) => {
      if (!isEditing) return;

      if (e.shiftKey && lastSelectedIndexRef.current !== null) {
        const start = Math.min(lastSelectedIndexRef.current, index);
        const end = Math.max(lastSelectedIndexRef.current, index);

        const shouldSelect = !selectedFileIds.has(fileId);
        const filesToToggle: string[] = [];

        for (let i = start; i <= end; i++) {
          const currentFileId = validFiles[i].publicId!;
          const isCurrentlySelected = selectedFileIds.has(currentFileId);

          if (shouldSelect && !isCurrentlySelected) {
            filesToToggle.push(currentFileId);
          } else if (!shouldSelect && isCurrentlySelected) {
            filesToToggle.push(currentFileId);
          }
        }

        filesToToggle.forEach(toggleFileSelection);
      } else {
        toggleFileSelection(fileId);
      }

      lastSelectedIndexRef.current = index;
    },
    [isEditing, toggleFileSelection, validFiles, selectedFileIds]
  );

  const imageData = useMemo(
    () =>
      validFiles.map((file, index) => ({
        publicId: file.publicId!,
        alt: `Image ${index + 1}`,
      })),
    [validFiles]
  );

  // Render individual grid cell
  const Cell = useCallback(
    ({
      columnIndex,
      rowIndex,
      style,
    }: {
      columnIndex: number;
      rowIndex: number;
      style: React.CSSProperties;
    }) => {
      const index = rowIndex * gridConfig.columns + columnIndex;
      if (index >= validFiles.length) return null;

      const file = validFiles[index];
      const fileId = file.publicId!;
      const isSelected = selectedFileIds.has(fileId);

      const adjustedStyle: React.CSSProperties = {
        ...style,
        left: (style.left as number) + gridConfig.gap / 2,
        top: (style.top as number) + gridConfig.gap / 2,
        width: (style.width as number) - gridConfig.gap,
        height: (style.height as number) - gridConfig.gap,
      };

      return (
        <div style={adjustedStyle}>
          <div
            className={`relative aspect-square w-full overflow-hidden rounded cursor-pointer group
              ${isEditing && isSelected ? "ring-4 ring-blue-500" : ""}
            `}
            onClick={(e) => {
              if (isEditing) {
                handleClick(fileId, index, e);
              } else {
                openOverviewRef.current?.(index);
              }
            }}
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

            {!isEditing && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 z-10" />
            )}

            <CloudinaryImage
              publicId={fileId}
              alt={`Image ${index + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      );
    },
    [validFiles, isEditing, selectedFileIds, handleClick, gridConfig]
  );

  return (
    <ImageOverview images={imageData}>
      {(openOverview) => {
        openOverviewRef.current = openOverview;

        return (
          <div
            ref={containerRef}
            className="p-4 border border-[#121212] bg-[#1e1e1e] h-[50vh] min-w-[90%] max-w-[90%]"
          >
            {validFiles.length > 0 ? (
              <FixedSizeGrid
                columnCount={gridConfig.columns}
                columnWidth={gridConfig.columnWidth}
                rowCount={Math.ceil(validFiles.length / gridConfig.columns)}
                rowHeight={gridConfig.rowHeight}
                width={gridSize.width}
                height={gridSize.height}
                overscanRowCount={2}
                className="scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
              >
                {Cell}
              </FixedSizeGrid>
            ) : (
              <div className="text-[#999] text-center py-8 h-full flex items-center justify-center">
                No files uploaded for this section
              </div>
            )}
          </div>
        );
      }}
    </ImageOverview>
  );
};
