"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const revealItems = Array.from(
      document.querySelectorAll<HTMLElement>("[data-scroll-reveal]"),
    );

    if (!revealItems.length) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    revealItems.forEach((item) => {
      const delay = item.dataset.scrollDelay;

      if (delay) {
        item.style.setProperty("--reveal-delay", `${delay}ms`);
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.14,
      },
    );

    revealItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
