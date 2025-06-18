import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import { defineConfig } from "vite"
import tsConfigPaths from "vite-tsconfig-paths"
import path from "path"

export default defineConfig({
  server: {
    port: 3000,
    allowedHosts: ["localhost", "127.0.0.1", "0.0.0.0"],
  },
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
