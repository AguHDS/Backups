import {
  AdvancedImage,
  lazyload,
} from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { cld } from "./cloudinaryConfig";
import { memo, useMemo } from "react";

interface CloudinaryImageProps {
  publicId: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  lazy?: boolean;
}

// Custom comparison to prevent unnecessary re-renders
const arePropsEqual = (prevProps: CloudinaryImageProps, nextProps: CloudinaryImageProps) => {
  return (
    prevProps.publicId === nextProps.publicId &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.lazy === nextProps.lazy &&
    prevProps.className === nextProps.className
  );
};

export const CloudinaryImage = memo(({
  publicId,
  alt,
  className = "",
  width = 400,
  height = 400,
  lazy = true,
}: CloudinaryImageProps) => {
  const img = useMemo(() => 
    cld
      .image(publicId)
      .resize(fill().width(width).height(height))
      .format("auto")
      .quality("auto"),
    [publicId, width, height]
  );

  const plugins = useMemo(() => {
    const pluginArray = [];

    if (lazy) {
      // Configure lazyload to only load when image is visible
      // No rootMargin to prevent loading images outside viewport
      pluginArray.push(lazyload({ 
        rootMargin: '0px'
      }));
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
