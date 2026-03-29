import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/analyze': {
        target: 'https://resumeai-hsud.onrender.com',
        changeOrigin: true,
        rewrite: (path) => '/analyze',
      },
    },
  },
})
