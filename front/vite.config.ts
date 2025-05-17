import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 4173,
    https: {
      key: 'C:/win-acme/certs/mentorhub.info.gf-key.pem',
      cert: 'C:/win-acme/certs/mentorhub.info.gf-crt.pem'
    }
  },
  preview: {
    allowedHosts: ['mentorhub.info.gf']
  }
})
