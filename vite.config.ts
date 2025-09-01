import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
    extensions: [".ts", ".js", ".mjs", ".json"],
  },
  test: {
    environment: "node",
    coverage: {
      reporter: ["text", "html", "lcov"],
      exclude: [
        "src/server.ts",
        "src/app.ts",
        "src/env/**",
        "src/infra/**",
        "src/routes/**",
        "src/prisma/**",
        "src/**/*.controller.ts",
        "**/*.d.ts",
        "**/*.spec.ts",
      ],
    },
  },
});
