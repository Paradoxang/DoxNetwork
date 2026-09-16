import {
  Clapperboard,
  Gamepad2,
  GraduationCap,
  KeyRound,
  LayoutTemplate,
  Music2,
  Palette,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { CategoryId } from "@/data/catalog";

const icons: Record<CategoryId, LucideIcon> = {
  streaming: Clapperboard,
  musica: Music2,
  ia: Sparkles,
  software: KeyRound,
  diseno: Palette,
  gaming: Gamepad2,
  cursos: GraduationCap,
  recursos: LayoutTemplate,
};

export function CategoryIcon({ id, className = "h-5 w-5" }: { id: CategoryId; className?: string }) {
  const Icon = icons[id];
  return <Icon className={className} aria-hidden="true" strokeWidth={1.8} />;
}
