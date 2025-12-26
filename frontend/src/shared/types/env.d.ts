interface ImportMetaEnv {
    readonly VITE_BACKENDPORT: string;
    readonly VITE_CLOUDINARY_NAME: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }