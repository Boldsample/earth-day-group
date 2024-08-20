import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    port: 9000,
    https: true,
    host: "localhost",
  },
  resolve: {
    alias: {
      "@ui": "/src/ui",
      "@json": "/src/json",
      "@lang": "/src/lang",
      "@store": "/src/store",
      "@utils": "/src/utils",
      "@styles": "/src/styles",
      "@assets": "/src/assets",
      "@services": "/src/services",
      "@components": "/src/components",
      "@modules": "/src/components/modules",
    },
  },
  optimizeDeps: {
    exclude: ["@vis.gl/react-google-maps"],
  },
});
