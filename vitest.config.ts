import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    // Rules tests need the Firestore emulator, so they run under a separate
    // script (`test:rules`) via `firebase emulators:exec`.
    include: ["src/**/*.test.ts"],
    exclude: ["src/__tests__/firestore.rules.test.ts", "node_modules/**"],
  },
});
