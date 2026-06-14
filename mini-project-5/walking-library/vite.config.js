import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/aladin': {
        target: 'https://www.aladin.co.kr', 
        changeOrigin: true,
        secure: false, 
        rewrite: (path) => path.replace(/^\/aladin/, '')
      },
    },
  },
})