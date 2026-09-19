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
    // Saca los <script> inline con los que arranca vite-react-ssg a archivos
    // .js con hash, para que la CSP de producción pueda ser `script-src 'self'`
    // (sin 'unsafe-inline' ni hashes que mantener a mano). El JSON-LD y los
    // scripts con type="module" no se tocan: no son <script> pelados.
    //
    // Recorre en profundidad a propósito. Cuando solo miraba la raíz, las 26
    // páginas de /producto/ conservaban sus tres scripts inline: el navegador
    // los bloqueaba por CSP y, como uno de ellos declara el nombre del
    // manifiesto de datos, la página acababa pidiendo
    // `static-loader-data-manifest-undefined.json` y recibiendo un 404.
    onFinished(dir: string) {
      const externaliza = (carpeta: string) => {
        for (const entrada of fs.readdirSync(carpeta, { withFileTypes: true })) {
          const ruta = path.join(carpeta, entrada.name);
          if (entrada.isDirectory()) {
            externaliza(ruta);
            continue;
          }
          if (!entrada.name.endsWith(".html")) continue;
          const html = fs.readFileSync(ruta, "utf8");
          const out = html.replace(
            /<script>([\s\S]*?)<\/script>/g,
            (_m, code: string) => {
              const hash = crypto
                .createHash("sha256")
                .update(code)
                .digest("hex")
                .slice(0, 16);
              const name = `ssg-boot-${hash}.js`;
              // Siempre en la raíz, y referenciados con ruta absoluta: así el
              // mismo archivo sirve para /index.html y para /producto/x.html.
              fs.writeFileSync(path.join(dir, name), code);
              return `<script src="/${name}"></script>`;
            }
          );
          if (out !== html) fs.writeFileSync(ruta, out);
        }
      };
      externaliza(dir);

      // El manifiesto del prerender ya cumplió: fuera de lo publicado.
      fs.rmSync(path.join(dir, ".vite"), { recursive: true, force: true });
    },
  },
});
