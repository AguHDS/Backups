import { AdvancedImage, lazyload } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { cld } from "./cloudinaryConfig";
import { memo, useMemo } from "react";

interface CloudinaryImageProps {
  publicId: string;
  alt: string;
  className?: string;
  lazy?: boolean;
}

// Custom comparison to prevent unnecessary re-renders
const arePropsEqual = (
  prevProps: CloudinaryImageProps,
  nextProps: CloudinaryImageProps
) => {
  return (
    prevProps.publicId === nextProps.publicId &&
    prevProps.lazy === nextProps.lazy &&
    prevProps.className === nextProps.className
  );
};

export const CloudinaryImage = memo(({
  publicId,
  alt,
  className = "",
  lazy = true,
}: CloudinaryImageProps) => {
  const img = useMemo(
    () =>
      cld
        .image(publicId)
        .resize(fill())
        .format("auto")
        .quality("auto"),
    [publicId]
  );

  const plugins = useMemo(() => {
    const pluginArray = [];

    if (lazy) {
      pluginArray.push(
        lazyload({
          rootMargin: "0px",
        })
      );
    }

    return pluginArray;
  }, [lazy]);

  return (
    <AdvancedImage
      cldImg={img}
      alt={alt}
      className={className}
      plugins={plugins}
    />
  );
}, arePropsEqual);
