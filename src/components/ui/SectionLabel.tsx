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
      className={`inline-flex w-fit max-w-full items-center justify-center whitespace-normal rounded-full border px-3 py-1.5 text-center text-xs font-black uppercase leading-5 tracking-[0.08em] ${toneClassName} ${className}`}
    >
      {children}
    </p>
  );
}
