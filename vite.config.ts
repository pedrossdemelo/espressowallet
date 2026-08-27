import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "service-worker.ts",
      injectRegister: null,
      manifest: false,
      injectManifest: {
        injectionPoint: "self.__WB_MANIFEST",
        rollupFormat: "iife",
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
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    outDir: "build",
    // Firestore 12 is ~533 kB minified but only ~157 kB over the wire. Keep
    // the warning useful for actual regressions without flagging that SDK.
    chunkSizeWarningLimit: 600,
    rolldownOptions: {
      output: {
        // Split the two biggest dependencies into their own chunks so a
        // change to app code doesn't invalidate ~900kB of vendor code the
        // browser already cached, and so they can load in parallel with it.
        codeSplitting: {
          groups: [
            {
              name: "firebase-firestore",
              test: /node_modules\/@firebase\/(firestore|webchannel-wrapper)\//,
            },
            {
              name: "firebase-auth",
              test: /node_modules\/@firebase\/auth\//,
            },
            { name: "firebase", test: /node_modules\/@?firebase\// },
            { name: "mui", test: /node_modules\/@mui\// },
          ],
        },
      },
    },
  },
});
