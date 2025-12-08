declare module "cloudinary-react" {
  import * as React from "react";

  interface ImageProps {
    publicId: string;
    width?: number | string;
    height?: number | string;
    crop?: string;
    alt?: string;
    className?: string;
  }

  interface CloudinaryContextProps {
    cloudName: string;
    children: React.ReactNode;
  }

  export class Image extends React.Component<ImageProps, object> {}
  export class CloudinaryContext extends React.Component<
    CloudinaryContextProps,
    object
  > {}
}
