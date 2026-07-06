import type { ReactNode } from "react";
import { getDynamicWhatsAppLink } from "@/src/lib/publicApi";

type WhatsAppButtonProps = {
  children?: ReactNode;
  productName?: string;
  category?: string;
  price?: string | number;
  fullWidth?: boolean;
  variant?: "primary" | "outline";
};

export async function WhatsAppButton({
  children = "Konsultasi via WhatsApp",
  productName,
  category,
  price,
  fullWidth = false,
  variant = "primary",
}: WhatsAppButtonProps) {
  const waLink = await getDynamicWhatsAppLink({
    category,
    productName,
    price,
  });

  const baseClassName =
    "motion-button inline-flex items-center justify-center rounded-xl px-5 py-3.5 text-sm font-black tracking-[0.08em] sm:text-base";
  const widthClassName = fullWidth ? "w-full" : "";
  const variantClassName =
    variant === "outline"
      ? "border-2 border-primary text-primary hover:bg-primary hover:text-white"
      : "bg-primary text-white hover:bg-tertiary";

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noreferrer"
      className={`${baseClassName} ${widthClassName} ${variantClassName}`}
    >
      {children}
    </a>
  );
}
