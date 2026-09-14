/**
 * cPanel / Phusion Passenger entry point for the Getgas Energen website.
 *
 * Passenger requires a CommonJS startup file. This shim boots the built
 * Nitro/Node server produced by `npm run build` and lets it bind to the
 * port Passenger provides.
 *
 * Application root : /home/<cpanel-user>/getgas-energen
 * Startup file     : app.js
 * Node version     : 20 or newer
 */

process.env.NODE_ENV = process.env.NODE_ENV || "production";
process.env.PORT = process.env.PORT || process.env.PASSENGER_PORT || "3000";
process.env.HOST = process.env.HOST || "127.0.0.1";

const path = require("path");
const serverEntry = path.join(__dirname, ".output", "server", "index.mjs");

import(serverEntry).catch((error) => {
  console.error("[getgas-energen] Failed to start the server:", error);
  process.exit(1);
});
