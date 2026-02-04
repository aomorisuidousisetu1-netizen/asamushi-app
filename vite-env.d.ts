// Fixed: Removed the reference to 'vite/client' which caused a "type definition file not found" error.
// The necessary interface declarations for ImportMeta and NodeJS.ProcessEnv are already provided manually below.

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
