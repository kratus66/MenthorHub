import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import type { UserConfig } from "vite";
import path from "path";

export default defineConfig(({ mode }): UserConfig => {
  const config: UserConfig = {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: "0.0.0.0",
      port: 4173,
      allowedHosts: ["mentorhub.info.gf"],
    },
    preview: {
      allowedHosts: ["mentorhub.info.gf"],
    },
  };

  if (mode === "production") {
/*     config.server = {
      ...config.server,
      https: {
        key: "/etc/letsencrypt/live/mentorhub.info.gf/privkey.pem",
        cert: "/etc/letsencrypt/live/mentorhub.info.gf/fullchain.pem",
      },
    }; */
  }

  return config;
});
