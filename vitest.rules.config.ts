import { defineConfig } from "vitest/config";

// Firestore security-rules tests. Run through `npm run test:rules`, which wraps
// this in `firebase emulators:exec` so the emulator is up on 127.0.0.1:8080.
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    include: ["src/__tests__/firestore.rules.test.ts"],
    // The emulator is a shared resource; keep the suites off each other's toes.
    fileParallelism: false,
    testTimeout: 20000,
    hookTimeout: 30000,
  },
});
