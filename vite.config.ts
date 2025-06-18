import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import { defineConfig } from "vite"
import tsConfigPaths from "vite-tsconfig-paths"
import path from "path"

export default defineConfig({
  resolve: {
    alias: {
      "@/*": path.resolve(__dirname, "./src/*"),
    },
  },
  build: {
    target: "esnext",
  },
  plugins: [
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tanstackStart({
      react: {
        babel: {
          plugins: [["babel-plugin-react-compiler"]],
        },
      },
    }),
  ],
})
