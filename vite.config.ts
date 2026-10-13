import vinext from "vinext";
import { defineConfig } from "vite";
import { sites } from "./build/sites-vite-plugin";

// Portable static export: no Cloudflare account or server-side bindings needed.
export default defineConfig({ plugins: [vinext(), sites()] });
