"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const getHiddenRevealItems = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>(
          "[data-scroll-reveal]:not(.is-visible)",
        ),
      );

    const applyDelay = (item: HTMLElement) => {
      const delay = item.dataset.scrollDelay;

      if (delay) {
        item.style.setProperty("--reveal-delay", `${delay}ms`);
      }
    };

    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      getHiddenRevealItems().forEach((item) =>
        item.classList.add("is-visible"),
      );
      return;
    }

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

    const observeHiddenItems = () => {
      getHiddenRevealItems().forEach((item) => {
        applyDelay(item);
        observer.observe(item);
      });
    };

    observeHiddenItems();
    window.addEventListener("scroll-reveal:refresh", observeHiddenItems);

    return () => {
      window.removeEventListener("scroll-reveal:refresh", observeHiddenItems);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
