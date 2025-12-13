import { Cloudinary } from "@cloudinary/url-gen";

const cloudName = import.meta.env.VITE_CLOUDINARY_NAME;

if (!cloudName) {
  console.warn(
    "VITE_CLOUDINARY_CLOUDINARY_NAME is not set in environment variables. Using default 'demo' cloud name."
  );
}

export const cld = new Cloudinary({
  cloud: {
    cloudName: cloudName || "demo",
  },
});
