import { memo, useCallback, useEffect, useMemo } from "react";
import { CloudinaryImage } from "@/services/Cloudinary";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  currentImageIndex: number;
  images: Array<{ publicId: string; alt?: string }>;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const ImageOverviewModalComponent = ({
  currentImageIndex,
  images,
  isOpen,
  onClose,
  onNext,
  onPrevious,
}: Props) => {
  const currentImage = useMemo(
    () => (images.length > 0 ? images[currentImageIndex] : null),
    [images, currentImageIndex]
  );

  const altText = useMemo(
    () => currentImage?.alt || `Image ${currentImageIndex + 1}`,
    [currentImage?.alt, currentImageIndex]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          onPrevious();
          break;
        case "ArrowRight":
          onNext();
          break;
      }
    },
    [isOpen, onClose, onNext, onPrevious]
  );

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !currentImage) return null;

  const hasMultipleImages = images.length > 1;
  const canGoPrevious = hasMultipleImages && currentImageIndex > 0;
  const canGoNext = hasMultipleImages && currentImageIndex < images.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm transition-opacity duration-300"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
      aria-label="Image overview"
    >
      <div className="relative w-full h-full max-w-[95vw] max-h-[95vh] flex items-center justify-center p-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
          aria-label="Close image overview"
        >
          <X size={24} />
        </button>

        {hasMultipleImages && (
          <button
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous image"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {hasMultipleImages && (
          <button
            onClick={onNext}
            disabled={!canGoNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next image"
          >
            <ChevronRight size={28} />
          </button>
        )}

        {/* Image counter */}
        {hasMultipleImages && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}

        {/* Image container - memoized */}
        <div className="relative w-full h-full flex items-center justify-center">
          <CloudinaryImage
            key={`modal-${currentImage.publicId}-${currentImageIndex}`}
            publicId={currentImage.publicId}
            alt={altText}
            className="max-w-full max-h-full object-contain"
            lazy={false}
          />
        </div>

        {hasMultipleImages && (
          <>
            {canGoPrevious && (
              <div
                className="absolute left-0 top-0 bottom-0 w-1/4 z-10 md:hidden"
                onClick={onPrevious}
                aria-hidden="true"
              />
            )}
            {canGoNext && (
              <div
                className="absolute right-0 top-0 bottom-0 w-1/4 z-10 md:hidden"
                onClick={onNext}
                aria-hidden="true"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export const ImageOverviewModal = memo(ImageOverviewModalComponent);
