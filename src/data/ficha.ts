/**
 * Contenido de la ficha de producto por línea (plantilla corta, encargo de
 * Santiago del 25-sep-2026: docs/ENCARGO-ASTRO-plantilla-fichas.md).
 *
 * Todo sale de datos que ya existen: si un dato no está, su tarjeta no sale.
 * Nada inventado: el dato técnico de tecnología y las caladas de los vapes se
 * leen del nombre del producto tal como lo trae el proveedor.
 */
import type { Product } from "./catalog";
import { reportHours } from "./legal";
import { conditionInfo, subLabel, vapeWarning } from "./lineas";
import { disclaimer, families, paraLabel, qualityInfo } from "./perfumeria";

export type IconoFicha = "para" | "familia" | "calidad" | "referencia" | "tipo" | "condicion" | "marca" | "tecnico" | "caladas" | "edad";

export interface Tarjeta {
  icono: IconoFicha;
  label: string;
  value: string;
  texto?: string;
  /** Tono propio (la familia olfativa trae el suyo). */
  hue?: string;
}

/** Datos técnicos que ya dice el nombre: mAh, W, DPI, GB, TB o número de juegos. */
export function datoTecnico(nombre: string): string | undefined {
  const unidad = (u: string) => (/^juegos$/i.test(u) ? "juegos" : /^mah$/i.test(u) ? "mAh" : u.toUpperCase());
  const datos: string[] = [];
  // El número no puede ir pegado a una letra: «M29 DPI» no son 29 DPI
  for (const m of nombre.matchAll(/(?<![A-Za-z\d.,])(\d{1,3}(?:[.,]\d{3})+|\d+)\s?(mAh|W|DPI|GB|TB|juegos)\b/gi)) datos.push(`${m[1]} ${unidad(m[2])}`);
  // Y al revés: «DPI 1600»
  for (const m of nombre.matchAll(/\bDPI\s?(\d{3,5})\b/gi)) datos.push(`${m[1]} DPI`);
  return datos.length ? [...new Set(datos)].join(" · ") : undefined;
}

/** Caladas del vape, del número del nombre («Vera 22000 puffs» → 22.000). */
export function caladas(nombre: string): string | undefined {
  const m = nombre.match(/(\d{4,6})/);
  // A mano y no con toLocaleString: el prerender y el navegador pueden traer ICU distintos
  return m ? m[1].replace(/\B(?=(\d{3})+(?!\d))/g, ".") : undefined;
}

/** La referencia de un perfume con su casa: «Yara (Lattafa)». */
const referencia = (p: Product) => {
  const pf = p.perfume!;
  return pf.brand ? `${pf.line} (${pf.brand})` : pf.line;
};

/** «La ficha»: los datos que importan, en tarjetas. */
export function tarjetasDe(p: Product): Tarjeta[] {
  const out: (Tarjeta | false | "" | undefined)[] = [];
  if (p.perfume) {
    const pf = p.perfume;
    const q = qualityInfo[pf.quality];
    const fam = pf.family ? families[pf.family] : undefined;
    out.push(
      { icono: "para", label: "Para", value: pf.kind === "set" ? `${paraLabel[pf.para]} · set de regalo` : paraLabel[pf.para] },
      fam && { icono: "familia", label: "Familia olfativa", value: fam.label, texto: fam.text, hue: fam.hue },
      { icono: "calidad", label: "Calidad", value: q.label, texto: q.text },
      { icono: "referencia", label: "Fragancia de referencia", value: referencia(p) }
    );
  } else if (p.articulo) {
    const a = p.articulo;
    if (a.line === "vapes") {
      const n = caladas(p.name);
      out.push(
        n && { icono: "caladas", label: "Caladas", value: `${n} caladas`, texto: "Las que anuncia la marca en el nombre del producto." },
        a.brand && { icono: "marca", label: "Marca", value: a.brand },
        { icono: "edad", label: "Solo mayores de 18", value: "Venta con verificación de edad" }
      );
    } else {
      const tecnico = a.line === "tecnologia" ? datoTecnico(p.name) : undefined;
      out.push(
        { icono: "tipo", label: "Tipo", value: subLabel[a.sub] },
        a.condition && { icono: "condicion", label: "Condición", value: conditionInfo[a.condition].label, texto: a.condition === "original" ? conditionInfo.original.text : undefined },
        a.brand && { icono: "marca", label: a.condition === "replica" ? "Marca de referencia" : "Marca", value: a.brand },
        tecnico && { icono: "tecnico", label: "Dato técnico", value: tecnico, texto: "Tal como lo dice el nombre del producto." }
      );
    }
  }
  return out.filter(Boolean) as Tarjeta[];
}

/** En perfumes, vapes y audífonos intraauriculares el retracto no aplica una vez abiertos (política de cambios). */
export const retractoSinAbrir = (p: Product) =>
  Boolean(p.perfume) || p.articulo?.line === "vapes" || (p.articulo?.sub === "audio" && /airpods|audífonos|auriculares/i.test(p.name));

export const textoRetracto = (p: Product) =>
  retractoSinAbrir(p) ? "Garantía legal y 5 días hábiles de retracto, si no lo has abierto" : "Garantía legal y 5 días hábiles de retracto";

/** «Lo que recibes, y lo que no es». */
export function recibesDe(p: Product): { recibes: string[]; aparte: { titulo: string; lineas: string[] } | null; advertencia?: string } {
  if (p.perfume) {
    const q = qualityInfo[p.perfume.quality];
    return {
      recibes: [`La versión ${q.short} inspirada en ${referencia(p)}.`, q.text],
      aparte: { titulo: "Lo que no es", lineas: [disclaimer] },
    };
  }
  const a = p.articulo;
  if (!a) return { recibes: [p.name], aparte: null };
  const vape = a.line === "vapes" ? vapeWarning : undefined;
  if (a.condition === "replica") {
    return {
      recibes: [a.brand ? `Una réplica inspirada en un modelo de ${a.brand}.` : "Una réplica.", `${subLabel[a.sub]}: ${p.name}.`],
      aparte: { titulo: "Lo que no es", lineas: [disclaimer] },
      advertencia: vape,
    };
  }
  if (a.condition === "original") {
    return {
      recibes: [conditionInfo.original.text, `${subLabel[a.sub]}: ${p.name}.`],
      aparte: { titulo: "Ten en cuenta", lineas: ["Las fotos son del proveedor. Si tienes dudas del modelo, color o garantía, pregúntanos antes de pagar."] },
      advertencia: vape,
    };
  }
  return { recibes: [`${subLabel[a.sub]}: ${p.name}.`, p.description], aparte: null, advertencia: vape };
}

/** «Lo que tienes que saber»: respuestas abiertas, afirmaciones y no preguntas. */
export function saberDe(p: Product): { titulo: string; texto: string }[] {
  const out = [
    { titulo: "Pagas por Nequi o Llave Bre-B", texto: "Al finalizar la compra, sin tarjeta. Luego nos mandas el comprobante por WhatsApp." },
    { titulo: "Te confirmamos antes de despachar", texto: "Te escribimos por WhatsApp para confirmar tu pedido y la dirección antes de que salga." },
    { titulo: "Llega en 3 a 6 días hábiles", texto: "El envío es gratis a toda Colombia y te pasamos el número de guía para que lo sigas." },
    {
      titulo: "Si llega mal, lo resolvemos",
      texto: `Repórtalo en las ${reportHours} horas siguientes con fotos o un video. Además te cubre la garantía legal${
        retractoSinAbrir(p) ? ", y si no lo has abierto tienes 5 días hábiles de retracto" : " y tienes 5 días hábiles de retracto"
      }.`,
    },
  ];
  if (p.perfume) {
    const q = qualityInfo[p.perfume.quality];
    out.splice(0, 0, { titulo: `Es una versión ${q.short}`, texto: q.text });
  }
  if (p.articulo?.line === "vapes") out.splice(0, 0, { titulo: "Solo para mayores de 18", texto: vapeWarning });
  return out;
}
