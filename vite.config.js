import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Force the base path to be root
  base: '/', 
  build: {
    // Ensure the output matches what Vercel expects
    outDir: 'dist', 
  }
})