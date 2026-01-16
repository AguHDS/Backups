import { useState, useCallback, useMemo } from "react";
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
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const validImages = useMemo(
    () => images.filter((img) => img.publicId?.trim()),
    [images]
  );

  const openOverview = useCallback(
    (index: number) => {
      if (!validImages.length) return;
      setCurrentIndex(index);
      setIsOpen(true);
    },
    [validImages.length]
  );

  const goNext = useCallback(() => {
    setCurrentIndex((i) =>
      i < validImages.length - 1 ? i + 1 : 0
    );
  }, [validImages.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) =>
      i > 0 ? i - 1 : validImages.length - 1
    );
  }, [validImages.length]);

  return (
    <>
      {children(openOverview)}
      <ImageOverviewModal
        isOpen={isOpen}
        images={validImages}
        currentIndex={currentIndex}
        onClose={() => setIsOpen(false)}
        onNext={goNext}
        onPrevious={goPrev}
      />
    </>
  );
};
