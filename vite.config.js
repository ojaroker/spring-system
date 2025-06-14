// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/spring-system/", // ← MUST match the repo name
  plugins: [react()],
});
