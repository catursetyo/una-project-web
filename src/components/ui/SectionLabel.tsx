import type { ReactNode } from "react";

type SectionLabelProps = {
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
};

export function SectionLabel({
  children,
  tone = "light",
  className = "",
}: SectionLabelProps) {
  const toneClassName =
    tone === "dark"
      ? "border-white/15 bg-white/10 text-una-gold-light"
      : "border-primary/15 bg-primary/10 text-primary";

  return (
    <p
      className={`inline-flex w-fit items-center rounded-full border px-3 py-1.5 text-xs font-black uppercase tracking-[0.08em] ${toneClassName} ${className}`}
    >
      {children}
    </p>
  );
}
