// Production build configuration for HostPinnacle cPanel (Node.js / Passenger).
//
// The default vite.config.ts targets the Lovable preview/published runtime.
// This config keeps the same app but emits a plain Node server bundle:
//
//   npm run build:cpanel      →  dist-cpanel/{server,client}
//
// See deploy/README.md for the cPanel setup steps.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: {
    preset: "node-server",
    output: {
      dir: "dist-cpanel",
      serverDir: "dist-cpanel/server",
      publicDir: "dist-cpanel/client",
    },
  },
});
