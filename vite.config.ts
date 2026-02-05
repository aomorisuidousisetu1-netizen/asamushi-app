
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // 文字列の置換として定義
    'process.env.GOOGLE_SCRIPT_URL': JSON.stringify(process.env.GOOGLE_SCRIPT_URL || '')
  }
});
