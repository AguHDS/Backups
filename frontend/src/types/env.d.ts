interface ImportMetaEnv {
    readonly VITE_FRONTENDPORT: string;
    readonly VITE_BACKENDPORT: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }