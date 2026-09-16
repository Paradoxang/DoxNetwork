import type { ReactNode } from "react";
import { Reveal } from "@/lib/anim";

/** Kicker de marca + titular en Kenney + bajada opcional. */
export function SectionHeading({
  kicker,
  title,
  children,
  center = false,
  action,
}: {
  kicker?: string;
  title: string;
  children?: ReactNode;
  center?: boolean;
  action?: ReactNode;
}) {
  return (
    <Reveal
      className={`flex flex-col gap-4 ${center ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"}`}
    >
      <div className={center ? "max-w-2xl" : "max-w-2xl"}>
        {kicker && <p className="kicker">{kicker}</p>}
        <h2 className={`display text-[clamp(28px,4.2vw,44px)] ${kicker ? "mt-3" : ""}`}>{title}</h2>
        {children && <p className="mt-3 text-base leading-relaxed text-mute">{children}</p>}
      </div>
      {action}
    </Reveal>
  );
}
