/**
 * cPanel / Phusion Passenger entry point for the Getgas Energen website.
 *
 * Passenger requires a CommonJS startup file. This shim boots the built
 * Node server (produced by `npm run build:cpanel`) and lets it bind to the
 * port Passenger provides.
 *
 * Application root : /home/<cpanel-user>/getgas-energen
 * Startup file     : app.js
 * Node version     : 20 or newer
 *
 * Expected layout inside the application root:
 *   app.js
 *   package.json
 *   server/index.mjs   <- server bundle
 *   client/...         <- static assets
 */

process.env.NODE_ENV = process.env.NODE_ENV || "production";
process.env.PORT = process.env.PORT || process.env.PASSENGER_PORT || "3000";
process.env.HOST = process.env.HOST || "127.0.0.1";

const path = require("path");
const { pathToFileURL } = require("url");

const serverEntry = pathToFileURL(path.join(__dirname, "server", "index.mjs")).href;

import(serverEntry).catch((error) => {
  console.error("[getgas-energen] Failed to start the server:", error);
  process.exit(1);
});
