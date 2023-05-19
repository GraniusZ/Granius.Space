import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import svgr from "vite-plugin-svgr";
// https://vitejs.dev/config/
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@ui": path.resolve(__dirname, "./src/ui"),
      "@modules": path.resolve(__dirname, "./src/modules"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@slices": path.resolve(__dirname, "./src/slices/slices"),
      "@fonts": path.resolve(__dirname, "./src/assets/fonts"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "types": path.resolve(__dirname, "./src/types"),
    },
  },
  plugins: [react(), tsconfigPaths(), svgr()],
})
