import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // three.js is lazy-loaded with the hero canvas; it is large by nature.
  build: { chunkSizeWarningLimit: 1000 },
});
