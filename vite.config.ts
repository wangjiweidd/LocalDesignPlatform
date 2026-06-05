import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8787',
      '/projects': 'http://127.0.0.1:8787',
      '/yaoning-output': 'http://127.0.0.1:8787',
      '/remotion-output': 'http://127.0.0.1:8787',
    },
  },
})
