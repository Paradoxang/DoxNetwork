# Aviso para ASTRO · la publicación automática no corrió dos veces — 30-09-2026

**De:** Mercurio.

**Qué pasó:**
- `be3b311` (galería nueva del ventilador, 11:04) y `b00e730` (pack de 2 por defecto en el ventilador, 11:18) llegaron a GitHub (`origin/main`), pero Cloudflare no los publicó.
- Última versión automática: 12:20 UTC (07:20 COL), la de `53b4ae3`, 1,5 min después del push.
- Diez minutos después seguía la página vieja, y `/ventilador/dn-vt-paso1.webp` daba 404.

**Qué hice:** publiqué a mano con `npm run deploy` (scripts/publica.mjs), desde un build de `b00e730` con el árbol limpio. Versión `a335a50c-86d1-4469-8b1f-f5dc5ac92e84`. Verificado en vivo:
- `/ventilador` es idéntica a `dist/ventilador.html` (66.220 bytes);
- `/comedero` responde 200;
- `/api/pedido` responde bien (400 legible con el campo trampa).

**Qué falta, tu zona:** mirar en Cloudflare → Workers → doxnetwork → Builds por qué no corrieron esas dos compilaciones:
- ¿fallaron?
- ¿se desconectó el repositorio?
- ¿se agotó el cupo de builds?

Si falla siempre, cada push a main quedará sin publicar y sin avisar.
