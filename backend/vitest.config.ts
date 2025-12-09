/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    exclude: ["**/index.ts", "**/dtos/**", "node_modules", "dist"],
    include: ["tests/**/*.test.ts", "tests/**/*.spec.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
      exclude: [
        "**/index.ts",
        "**/dtos/**",
        "**/domain/ports/repositories/**",
        "**/shared/dtos/**",
        "**/services/**",
        "**/infraestructure/config/**",
        "**/types/**",
        "**/*.d.ts",
        "./vitest.config.ts",
        "tests/**/*",
      ],
      include: ["src/**/*"],
      reportsDirectory: "./coverage",
    },
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "./src"),
      },
      {
        find: "@tests",
        replacement: path.resolve(__dirname, "./tests"),
      },
      {
        find: "@/shared",
        replacement: path.resolve(__dirname, "./src/shared"),
      },
      {
        find: "@/domain",
        replacement: path.resolve(__dirname, "./src/domain"),
      },
      {
        find: "@/application",
        replacement: path.resolve(__dirname, "./src/application"),
      },
      {
        find: "@/infraestructure",
        replacement: path.resolve(__dirname, "./src/infraestructure"),
      },
    ],
  },
});
