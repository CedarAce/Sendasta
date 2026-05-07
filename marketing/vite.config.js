import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  // During dev, serve static assets from ../public (logo, videos, favicon already there)
  // During build, publicDir is disabled — webpack handles asset copying
  publicDir: command === 'serve' ? '../public' : false,
  build: {
    outDir: '../public',
    emptyOutDir: false,
    target: 'es2015',
  },
}))
