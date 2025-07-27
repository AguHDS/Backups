/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    exclude: ["**/index.ts", "**/dtos/**", "node_modules", "dist"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      exclude: [
        "**/index.ts",
        "**/dtos/**",
        "**/shared/dtos/**",
        "**/__tests__/**",
        "**/types/**",
        "**/*.d.ts",
        "./vitest.config.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
