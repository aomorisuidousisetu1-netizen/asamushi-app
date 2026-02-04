
/**
 * Fix: Removed '/// <reference types="vite/client" />' as the type definition was not found.
 * Manually defined ImportMeta interfaces to ensure environment variables are typed.
 */

interface ImportMetaEnv {
  readonly VITE_GOOGLE_SCRIPT_URL: string;
  readonly API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * Fix: Augmenting the existing NodeJS namespace for ProcessEnv.
 * This avoids the "Cannot redeclare block-scoped variable 'process'" error 
 * by extending the interface instead of trying to redeclare the global 'process' variable.
 */
declare namespace NodeJS {
  interface ProcessEnv {
    GOOGLE_SCRIPT_URL: string;
    API_KEY: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
}
