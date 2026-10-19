import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";
import flowbiteReact from "flowbite-react/plugin/vite";

export default defineConfig({
  plugins: [react(), tailwindcss(), flowbiteReact()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    
  },
  server: {
    proxy : {
     "/api": "http://127.0.0.1:8001",
      "/storage": "http://127.0.0.1:8001",
    },
    watch: {
      usePolling: true,
    },
  },
});