import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './client-entry.tsx',
      formats: ['iife'],
      name: 'GrowiPluginPdfExport',
      fileName: () => 'plugin.js',
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
});