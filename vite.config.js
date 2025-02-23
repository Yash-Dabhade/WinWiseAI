import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    proxy: {
      "/api/iam": {
        target: "https://iam.cloud.ibm.com",
        changeOrigin: true,
        secure: true, // Allow self-signed certificates (for dev only)
        rewrite: (path) => path.replace(/^\/api\/iam/, ""),
        logLevel: "debug", // Add this to see proxy logs
      },
      "/api/ml": {
        target: "https://us-south.ml.cloud.ibm.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/ml/, ""),
        logLevel: "debug",
      },
    },
  },
  plugins: [react(), tailwindcss()],
});
