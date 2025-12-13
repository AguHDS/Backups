import { useState, useCallback, useMemo, useRef } from "react";
import { ImageOverviewModal } from "./ImageOverviewModal";

interface ImageData {
  publicId: string;
  alt?: string;
}

interface Props {
  images: ImageData[];
  children: (openOverview: (index: number) => void) => React.ReactNode;
}

export const ImageOverview = ({ images, children }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const callbacksRef = useRef({
    onClose: () => setIsModalOpen(false),
  });

  const validImages = useMemo(
    () => images.filter((img) => img.publicId?.trim()),
    [images]
  );

  const openOverview = useCallback(
    (index: number) => {
      if (validImages.length === 0) return;

      const safeIndex = Math.max(0, Math.min(index, validImages.length - 1));
      setCurrentImageIndex(safeIndex);
      setIsModalOpen(true);
    },
    [validImages]
  );

  // Use functional updates to avoid changing dependencies
  const goToNext = useCallback(() => {
    setCurrentImageIndex((prevIndex) => {
      if (prevIndex < validImages.length - 1) {
        return prevIndex + 1;
      }
      return 0;
    });
  }, [validImages.length]);

  const goToPrevious = useCallback(() => {
    setCurrentImageIndex((prevIndex) => {
      if (prevIndex > 0) {
        return prevIndex - 1;
      }
      return validImages.length - 1;
    });
  }, [validImages.length]);

  // Memoize modal props
  const modalProps = useMemo(
    () => ({
      currentImageIndex,
      images: validImages,
      isOpen: isModalOpen,
      onClose: callbacksRef.current.onClose,
      onNext: goToNext,
      onPrevious: goToPrevious,
    }),
    [currentImageIndex, validImages, isModalOpen, goToNext, goToPrevious]
  );

  return (
    <>
      {children(openOverview)}
      <ImageOverviewModal {...modalProps} />
    </>
  );
};
