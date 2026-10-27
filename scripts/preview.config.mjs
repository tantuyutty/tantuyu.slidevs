import { existsSync, readdirSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { defineConfig } from "vite";
import { root } from "./slides.mjs";

export default defineConfig({
  root,
  appType: "mpa",
  build: {
    outDir: "dist",
  },
  preview: {
    host: "127.0.0.1",
    port: 4173,
    strictPort: true,
  },
  plugins: [
    {
      name: "slides-preview",
      configurePreviewServer(server) {
        const distDir = resolve(server.config.root, server.config.build.outDir);
        if (!existsSync(join(distDir, "index.html"))) {
          throw new Error("No built homepage found. Run pnpm build before pnpm preview.");
        }

        const slideSlugs = new Set(
          readdirSync(distDir, { withFileTypes: true })
            .filter((entry) => entry.isDirectory() && existsSync(join(distDir, entry.name, "index.html")))
            .map((entry) => entry.name),
        );

        // Run after static files so real assets take precedence over SPA routes.
        return () => {
          server.middlewares.use((request, _response, next) => {
            if (request.method !== "GET" && request.method !== "HEAD") return next();
            const accept = request.headers.accept;
            if (accept && !accept.includes("text/html") && !accept.includes("*/*")) return next();

            let pathname;
            try {
              pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
            } catch {
              return next();
            }

            const [, slug, section] = pathname.split("/");
            // Missing assets must remain 404s, not successful HTML responses.
            if (slideSlugs.has(slug) && section !== "assets" && !extname(pathname)) {
              request.url = `/${encodeURIComponent(slug)}/index.html`;
            }
            next();
          });
        };
      },
    },
  ],
});
