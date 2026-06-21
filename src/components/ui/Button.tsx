import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "gold" | "dark" | "outline" | "outlineLight" | "ghost";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  className?: string;
  ariaLabel?: string;
} & Pick<AnchorHTMLAttributes<HTMLAnchorElement>, "target" | "rel">;

const variantClassNames: Record<ButtonVariant, string> = {
  gold:
    "gold-cta shadow-[0_10px_18px_rgb(214_164_55_/_18%)] hover:brightness-105",
  dark: "bg-una-deep text-white hover:bg-una-emerald",
  outline:
    "border border-primary/35 bg-transparent text-primary hover:border-primary hover:bg-primary hover:text-white",
  outlineLight:
    "border border-white/30 bg-transparent text-white hover:border-white/45 hover:bg-white/10",
  ghost: "text-primary hover:bg-primary/10",
};

export function Button({
  href,
  children,
  variant = "gold",
  fullWidth = false,
  className = "",
  ariaLabel,
  target,
  rel,
}: ButtonProps) {
  const buttonClassName = [
    "motion-button inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-black tracking-[0.04em] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-secondary sm:text-base",
    variantClassNames[variant],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const sharedProps = {
    className: buttonClassName,
    "aria-label": ariaLabel,
    target,
    rel: target === "_blank" ? (rel ?? "noreferrer") : rel,
  };

  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <Link href={href} {...sharedProps}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} {...sharedProps}>
      {children}
    </a>
  );
}
