import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { serwist } from "@serwist/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    serwist({
      swSrc: "src/app/sw.ts",
      swDest: "sw.js",
      globDirectory: "dist",
      injectionPoint: "self.__SW_MANIFEST",
    }),
  ],
});
