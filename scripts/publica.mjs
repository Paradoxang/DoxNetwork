/**
 * Publica dist/ en Cloudflare, a mano.
 *
 *   npm run build && npm run deploy
 *
 * El camino normal es empujar a main: Cloudflare compila y publica solo. Esto
 * es la salida de emergencia, para cuando quieras subir algo sin pasar por
 * GitHub o comprobar un cambio antes de commitearlo.
 *
 * Lee las credenciales de .env (que no se sube a GitHub) y se las pasa a
 * wrangler por variables de entorno, nunca por la línea de comandos: así el
 * token no queda en el historial de la terminal ni en la lista de procesos.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Lector mínimo de .env: CLAVE=valor, ignora comentarios y líneas vacías. */
function leeEnv(archivo) {
  const valores = {};
  if (!fs.existsSync(archivo)) return valores;
  for (const linea of fs.readFileSync(archivo, "utf8").split(/\r?\n/)) {
    const limpia = linea.trim();
    if (!limpia || limpia.startsWith("#")) continue;
    const corte = limpia.indexOf("=");
    if (corte === -1) continue;
    valores[limpia.slice(0, corte).trim()] =
      limpia.slice(corte + 1).trim().replace(/^["']|["']$/g, "");
  }
  return valores;
}

const env = { ...leeEnv(path.join(raiz, ".env")), ...process.env };
const faltan = ["CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ACCOUNT_ID"].filter((k) => !env[k]);

if (faltan.length) {
  console.error(
    `\nFaltan credenciales: ${faltan.join(", ")}\n\n` +
      `Rellena esas líneas en el archivo .env de la raíz del proyecto.\n` +
      `Cómo sacarlas: mira los comentarios de .env.example.\n`
  );
  process.exit(1);
}

if (!fs.existsSync(path.join(raiz, "dist", "index.html"))) {
  console.error("\nNo hay build. Ejecuta primero:  npm run build\n");
  process.exit(1);
}

const args = ["wrangler", "deploy", ...process.argv.slice(2)];
console.log(`\n> npx ${args.join(" ")}\n`);

const r = spawnSync("npx", args, {
  cwd: raiz,
  env,
  stdio: "inherit",
  shell: process.platform === "win32",
});

process.exit(r.status ?? 1);
