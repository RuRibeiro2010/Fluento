import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: [
        {
          find: /^.*(gemini-provider|openai-provider|anthropic-provider).*$/,
          replacement: path.resolve(process.cwd(), 'src/lib/ai-runtime/client-provider-stub.ts'),
        },
        {
          find: '@',
          replacement: path.resolve(process.cwd(), '.'),
        },
      ],
    },
    build: {
      rollupOptions: {
        // Prevent server-side Gemini SDK from entering client browser bundles
        external: ['@google/genai'],
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
