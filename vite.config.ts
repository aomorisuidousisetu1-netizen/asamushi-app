
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // process.env 全体を定義するのではなく、特定のキーのみを安全に置換します
    'process.env.GOOGLE_SCRIPT_URL': JSON.stringify(process.env.GOOGLE_SCRIPT_URL || process.env.VITE_GOOGLE_SCRIPT_URL || '')
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild'
  }
});
