import type { CSSProperties } from "react";
import { Clapperboard, Gamepad2, GraduationCap, Headphones, Layers, MonitorPlay, Music2, Palette, Sparkles, SprayCan, Ticket, Watch, Wind, type LucideIcon, PawPrint } from "lucide-react";
import type { CategoryId } from "@/data/catalog";
import type { LineaId } from "@/data/lineas";

const icons: Record<CategoryId, LucideIcon> = {
  combos: Layers,
  streaming: Clapperboard,
  "cine-tv": Ticket,
  musica: Music2,
  ia: Sparkles,
  creatividad: Palette,
  gaming: Gamepad2,
  aprende: GraduationCap,
  perfumeria: SprayCan,
  relojeria: Watch,
  tecnologia: Headphones,
  vapes: Wind,
  mascotas: PawPrint,
};

const lineIcons: Record<LineaId, LucideIcon> = {
  digital: MonitorPlay,
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
