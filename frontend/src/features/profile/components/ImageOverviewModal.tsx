import { memo, useEffect, useCallback, useRef } from "react";
import { CloudinaryImage } from "@/services/Cloudinary";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  images: Array<{ publicId: string; alt?: string }>;
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const ImageOverviewModalComponent = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrevious,
}: Props) => {
  const backdropRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrevious();
      if (e.key === "ArrowRight") onNext();
    },
    [isOpen, onClose, onNext, onPrevious]
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

  if (!isOpen) return null;

  const buttonBase =
    "appearance-none border-none outline-none ring-0 " +
    "focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 " +
    "active:outline-none active:ring-0 " +
    "active:scale-95 transition-transform";

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onMouseDown={(e) => {
        if (e.target === backdropRef.current) {
          onClose();
        }
      }}
    >
      <div
        className="relative w-full h-full max-w-[98vw] max-h-[98vh] overflow-hidden flex items-center justify-center"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={onClose}
          className={`${buttonBase} absolute top-4 right-4 z-20 p-2 rounded-full bg-blue-800/40 backdrop-blur text-white hover:bg-blue-800/60 active:bg-blue-950/80`}
        >
          <X size={20} strokeWidth={1.5} />
        </button>

        {images.length > 1 && (
          <>
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={onPrevious}
              className={`${buttonBase} absolute left-4 z-20 p-3 rounded-full bg-blue-800/40 backdrop-blur text-white hover:bg-blue-800/60 active:bg-blue-950/80`}
            >
              <ChevronLeft size={28} strokeWidth={1.5} />
            </button>
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={onNext}
              className={`${buttonBase} absolute right-4 z-20 p-3 rounded-full bg-blue-800/40 backdrop-blur text-white hover:bg-blue-800/60 active:bg-blue-950/80`}
            >
              <ChevronRight size={28} strokeWidth={1.5} />
            </button>
          </>
        )}

        <div className="relative w-full h-full overflow-hidden">
          <div
            className="flex h-full transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {images.map((img, i) => (
              <div
                key={img.publicId}
                className="w-full h-full flex-shrink-0 flex items-center justify-center"
              >
                <CloudinaryImage
                  publicId={img.publicId}
                  alt={img.alt ?? `Image ${i + 1}`}
                  className="max-w-[95vw] max-h-[95vh] object-contain"
                  lazy={false}
                  size={1200}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ImageOverviewModal = memo(ImageOverviewModalComponent);
