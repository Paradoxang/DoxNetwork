import {
  Clapperboard,
  Gamepad2,
  GraduationCap,
  Layers,
  Music2,
  Palette,
  Sparkles,
  Ticket,
  type LucideIcon,
} from "lucide-react";
import type { CategoryId } from "@/data/catalog";

const icons: Record<CategoryId, LucideIcon> = {
  combos: Layers,
  streaming: Clapperboard,
  "cine-tv": Ticket,
  musica: Music2,
  ia: Sparkles,
  creatividad: Palette,
  gaming: Gamepad2,
  aprende: GraduationCap,
};

export function CategoryIcon({ id, className = "h-5 w-5" }: { id: CategoryId; className?: string }) {
  const Icon = icons[id];
  return <Icon className={className} aria-hidden="true" strokeWidth={1.8} />;
}
