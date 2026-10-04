import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // three.js is lazy-loaded with the hero canvas; it is large by nature.
  build: {
    chunkSizeWarningLimit: 1000,
    // Modern targets, so the CSS minifier keeps unprefixed properties
    // like backdrop-filter instead of emitting only the -webkit- form.
    cssTarget: ["chrome111", "edge111", "firefox114", "safari16.4"],
  },
});
