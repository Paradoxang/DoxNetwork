// Exporta los SVG del logo a PNG con sharp (librsvg). Uso: node render.cjs
const path = require("path");
const sharp = require(path.join(process.env.SHARP_DIR, "sharp"));
const jobs = [
  ["doxnetwork-icon.svg", "doxnetwork-icon-2048.png", 2048],
  ["doxnetwork-icon-light.svg", "doxnetwork-icon-light-2048.png", 2048],
  ["doxnetwork-color.svg", "doxnetwork-logo-1600.png", 1600],
  ["doxnetwork-color-light.svg", "doxnetwork-logo-light-1600.png", 1600],
  ["doxnetwork-square.svg", "doxnetwork-square-1024.png", 1024],
  ["doxnetwork-favicon.svg", "favicon-512.png", 512],
  ["doxnetwork-favicon.svg", "favicon-192.png", 192],
  ["doxnetwork-favicon.svg", "apple-touch-icon.png", 180],
  ["doxnetwork-favicon.svg", "favicon-32.png", 32],
  ["doxnetwork-favicon.svg", "favicon-16.png", 16],
];
(async () => {
  for (const [src, out, w] of jobs) {
    await sharp(path.join(__dirname, src), { density: 300 }).resize({ width: w }).png().toFile(path.join(__dirname, "export", out));
    console.log("ok", out);
  }
})();
