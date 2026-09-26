import { useEffect, useState } from "react";

/**
 * Atribución de campañas hasta el checkout de Shopify (26-sep-2026).
 *
 * Los anuncios aterrizan con utm_*, fbclid o gclid en la URL, pero al navegar
 * dentro de la tienda (de /perfumeria a una ficha) la URL los pierde, y el
 * checkout, que vive en myshopify.com, ya no sabía de qué anuncio venía la
 * compra. Aquí se guardan al llegar, para toda la visita (sessionStorage), y
 * cada enlace de carrito los lleva. Gana el último anuncio: una URL con
 * parámetros nuevos reemplaza a los guardados.
 *
 * Solo pasan utm_*, fbclid y gclid: filtros como ?para=hombre no son de nadie
 * más que de la tienda.
 */
const CLAVE = "dn:atribucion";

/** Los parámetros de campaña de una query, sin el resto. "" si no hay. */
export function filtrarAtribucion(search: string): string {
  const salen = new URLSearchParams();
  for (const [k, v] of new URLSearchParams(search)) if (k.startsWith("utm_") || k === "fbclid" || k === "gclid") salen.set(k, v);
  return salen.toString();
}

/** Añade la atribución a un enlace. */
export const conAtribucion = (url: string, cola: string) => (cola ? `${url}${url.includes("?") ? "&" : "?"}${cola}` : url);

function guardarYLeer(): string {
  try {
    const nueva = filtrarAtribucion(window.location.search);
    if (nueva) sessionStorage.setItem(CLAVE, nueva);
    return sessionStorage.getItem(CLAVE) ?? "";
  } catch {
    // Almacenamiento bloqueado: al menos lo que traiga esta URL
    return filtrarAtribucion(window.location.search);
  }
}

/**
 * La atribución de la visita. Vacía en el prerender y en el primer render,
 * y se llena tras montar: así el HTML hidrata igual y el href se actualiza
 * con el siguiente render.
 */
export function useAtribucion(): string {
  const [cola, setCola] = useState("");
  useEffect(() => setCola(guardarYLeer()), []);
  return cola;
}
