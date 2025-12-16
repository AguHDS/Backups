import { AdvancedImage, lazyload } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { cld } from "./cloudinaryConfig";
import { memo, useMemo } from "react";

interface CloudinaryImageProps {
  publicId: string;
  alt: string;
  className?: string;
  lazy?: boolean;
  size?: number;
  onClick?: () => void;
  cacheBust?: number;
}

const arePropsEqual = (
  prevProps: CloudinaryImageProps,
  nextProps: CloudinaryImageProps
) => {
  return (
    prevProps.publicId === nextProps.publicId &&
    prevProps.lazy === nextProps.lazy &&
    prevProps.className === nextProps.className &&
    prevProps.size === nextProps.size &&
    prevProps.onClick === nextProps.onClick &&
    prevProps.cacheBust === nextProps.cacheBust
  );
};

export const CloudinaryImage = memo(
  ({
    publicId,
    alt,
    className = "",
    lazy = true,
    size = 400,
    onClick,
    cacheBust,
  }: CloudinaryImageProps) => {
    const img = useMemo(() => {
      const image = cld
        .image(publicId)
        .resize(fill().width(size).height(size))
        .format("auto")
        .quality("auto");
      
      // If there is cacheBust, force new version to avoid cache
      if (cacheBust) {
        image.setVersion(cacheBust.toString());
      }
      
      return image;
    }, [publicId, size, cacheBust]);

    const plugins = useMemo(() => {
      if (!lazy) return [];
      return [
        lazyload({
          rootMargin: "0px",
        }),
      ];
    }, [lazy]);

    return (
      <AdvancedImage
        cldImg={img}
        alt={alt}
        className={className}
        plugins={plugins}
        onClick={onClick}
      />
    );
  },
  arePropsEqual
);

CloudinaryImage.displayName = "CloudinaryImage";