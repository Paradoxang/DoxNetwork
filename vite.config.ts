import path from "path";
import fs from "node:fs";
import crypto from "node:crypto";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import type {} from "vite-react-ssg"; // augments UserConfig with `ssgOptions`

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    watch: {
      // Don't watch heavy source images sitting in the project root.
      // They are large/locked and crash the file watcher (EBUSY); the
      // optimized assets actually used by the app live in /public as .webp.
      ignored: ["**/*.png", "**/*.jpg", "**/*.jpeg"],
    },
  },
  ssgOptions: {
    // Externalize vite-react-ssg's inline bootstrap <script> blocks into hashed
    // .js files so the production CSP can be `script-src 'self'` (no
    // 'unsafe-inline', no per-build hashes to maintain). JSON-LD and module
    // scripts are left untouched (they aren't bare inline <script> tags).
    onFinished(dir: string) {
      for (const file of fs.readdirSync(dir)) {
        if (!file.endsWith(".html")) continue;
        const filePath = path.join(dir, file);
        const html = fs.readFileSync(filePath, "utf8");
        const out = html.replace(
          /<script>([\s\S]*?)<\/script>/g,
          (_m, code: string) => {
            const hash = crypto
              .createHash("sha256")
              .update(code)
              .digest("hex")
              .slice(0, 16);
            const name = `ssg-boot-${hash}.js`;
            fs.writeFileSync(path.join(dir, name), code);
            return `<script src="/${name}"></script>`;
          }
        );
        if (out !== html) fs.writeFileSync(filePath, out);
      }
    },
  },
});
