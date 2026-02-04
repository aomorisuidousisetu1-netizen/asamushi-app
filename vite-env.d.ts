
// Fix: Removed the reference to 'vite/client' which was causing a "Cannot find type definition file" error.
// The environment variables are manually typed below to ensure compatibility.

interface ImportMetaEnv {
  readonly VITE_GOOGLE_SCRIPT_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare namespace NodeJS {
  interface ProcessEnv {
    GOOGLE_SCRIPT_URL: string;
  }
}
