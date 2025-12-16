// frontend\src\services\Cloudinary\CloudinaryImage.tsx
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
  cacheBust?: number; // ← Nueva prop para bust de caché
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
    prevProps.cacheBust === nextProps.cacheBust // ← Incluir cacheBust en comparación
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
      
      // Si hay cacheBust, forzar nueva versión para evitar caché
      if (cacheBust) {
        // Cloudinary permite usar el parámetro "version" para bust de caché
        // Añadimos un timestamp basado en cacheBust
        image.setVersion(cacheBust.toString());
      }
      
      return image;
    }, [publicId, size, cacheBust]); // ← Incluir cacheBust en dependencias

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