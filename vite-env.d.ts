// Fix: Removed triple-slash reference to 'vite/client' as the type definition file was not found in the environment.
// Manually defining ImportMeta and process.env types to maintain type safety for the build process.

interface ImportMetaEnv {
  readonly VITE_GOOGLE_SCRIPT_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace NodeJS {
  interface ProcessEnv {
    GOOGLE_SCRIPT_URL: string;
    API_KEY: string;
  }
}
