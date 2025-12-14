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
    prevProps.onClick === nextProps.onClick
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
  }: CloudinaryImageProps) => {
    const img = useMemo(
      () =>
        cld
          .image(publicId)
          .resize(fill().width(size).height(size))
          .format("auto")
          .quality("auto"),
      [publicId, size]
    );

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
