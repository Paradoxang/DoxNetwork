import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Une clases y resuelve choques de Tailwind a favor de la última
 * ("relative" + "absolute" deja solo "absolute"). Convención de shadcn para
 * los componentes de components/ui.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
