import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import ReactSVG from 'react-svg'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    allowedHosts: ['localhost', '127.0.0.1', '::1', '0460-70-20-17-224.ngrok-free.app']
  }
})
