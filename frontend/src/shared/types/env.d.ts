interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    readonly VITE_CLOUDINARY_NAME: string;
    readonly VITE_QUERY_ENV: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }