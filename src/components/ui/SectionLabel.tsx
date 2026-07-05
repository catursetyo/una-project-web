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
    tone === "dark" ? "text-una-gold-light" : "text-primary";

  return (
    <p
      className={`inline-block max-w-full text-sm font-extrabold leading-5 ${toneClassName} ${className}`}
    >
      {children}
    </p>
  );
}
