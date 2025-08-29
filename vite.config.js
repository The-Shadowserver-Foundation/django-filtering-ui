import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    host: true,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      input: {
        listing: resolve("./js-src/listing.js"),
        filtering: resolve("./js-src/filtering.js"),
      },
      output: {
        dir: "./src/django_filtering_ui/static/django-filtering-ui/",
        entryFileNames: "[name].js",
      },
    },
    // Manually set option to empty output directory,
    // because output directory is technically owned by python package.
    emptyOutDir: true,
  },
  plugins: [
    vue(),
    cssInjectedByJsPlugin({ jsAssetsFilterFunction: () => true }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./js-src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
  },
});
