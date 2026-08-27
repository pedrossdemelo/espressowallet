import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "service-worker.ts",
      injectRegister: null,
      manifest: false,
      injectManifest: {
        injectionPoint: "self.__WB_MANIFEST",
        // Match the original CRA/workbox precache scope: build output JS,
        // CSS, HTML, and the self-hosted font files — vite-plugin-pwa's
        // default globPatterns don't pick up woff/woff2 on their own.
        globPatterns: ["**/*.{js,css,html,woff,woff2}"],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  server: {
    port: 3000,
  },
  build: {
    outDir: "build",
    // The default CSS minifier (lightningcss) drops the vietnamese-subset
    // @font-face rules from @fontsource's font CSS (verified: they survive
    // with minification off, and there's no non-lightningcss minifier
    // available in this Vite build). CSS is ~1% of the JS bundle size, so
    // leaving it unminified costs nothing worth trading font coverage for.
    cssMinify: false,
    rolldownOptions: {
      output: {
        // Split the two biggest dependencies into their own chunks so a
        // change to app code doesn't invalidate ~900kB of vendor code the
        // browser already cached, and so they can load in parallel with it.
        codeSplitting: {
          groups: [
            { name: "firebase", test: /node_modules\/@?firebase\// },
            { name: "mui", test: /node_modules\/@mui\// },
          ],
        },
      },
    },
  },
});
