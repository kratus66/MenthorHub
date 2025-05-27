import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import type { UserConfig } from 'vite';
import path from 'path';

export default defineConfig(({ mode }): UserConfig => {
   const config: UserConfig = {
      plugins: [react()],
      resolve: {
         alias: {
            '@': path.resolve(__dirname, './src'),
         },
      },
      server: {
         host: '0.0.0.0',
         port: 4173,
         allowedHosts: ['mentorhub.info.gf'],
      },
      preview: {
         allowedHosts: ['mentorhub.info.gf'],
      },
   };

   if (mode === 'production') {
      config.server = {
         ...config.server,
         https: {
            key: 'C:/win-acme/certs/mentorhub.info.gf-key.pem',
            cert: 'C:/win-acme/certs/mentorhub.info.gf-crt.pem',
         },
      };
   }

   return config;
});
