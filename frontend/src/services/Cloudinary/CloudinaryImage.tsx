import {
  AdvancedImage,
  lazyload,
  placeholder,
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
      // Use simple lazyload without rootMargin to avoid premature loading
      pluginArray.push(lazyload());
    }

    // Use vectorize placeholder mode for better performance
    pluginArray.push(placeholder({ mode: 'vectorize' }));

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
});
