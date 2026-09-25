import type { CSSProperties } from "react";
import { Headphones, PawPrint, SprayCan, Watch, Wind, type LucideIcon } from "lucide-react";
import type { CategoryId } from "@/data/catalog";
import type { LineaId } from "@/data/lineas";

const icons: Record<CategoryId, LucideIcon> = {
  perfumeria: SprayCan,
  relojeria: Watch,
  tecnologia: Headphones,
  vapes: Wind,
  mascotas: PawPrint,
};

const lineIcons: Record<LineaId, LucideIcon> = {
  perfumeria: SprayCan,
  relojeria: Watch,
  tecnologia: Headphones,
  vapes: Wind,
};

export function CategoryIcon({ id, className = "h-5 w-5", style }: { id: CategoryId; className?: string; style?: CSSProperties }) {
  const Icon = icons[id];
  return <Icon className={className} style={style} aria-hidden="true" strokeWidth={1.8} />;
}

export function LineIcon({ id, className = "h-5 w-5" }: { id: LineaId; className?: string }) {
  const Icon = lineIcons[id];
  return <Icon className={className} aria-hidden="true" strokeWidth={1.8} />;
}
