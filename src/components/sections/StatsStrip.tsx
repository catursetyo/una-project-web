"use client";

import { useEffect, useRef, useState } from "react";
import { stats } from "@/src/data/landing";
import { getAnimatedStatValue } from "@/src/lib/animateStat.mjs";
import { Container } from "@/src/components/layout/Container";

export function StatsStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    let animationFrame = 0;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      animationFrame = requestAnimationFrame(() => setProgress(1));
      return () => cancelAnimationFrame(animationFrame);
    }

    let isVisible = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const nextIsVisible = entry.intersectionRatio >= 0.35;

        if (nextIsVisible === isVisible) return;

        isVisible = nextIsVisible;
        cancelAnimationFrame(animationFrame);

        if (!nextIsVisible) {
          setProgress(0);
          return;
        }

        const startedAt = performance.now();

        const animate = (now: number) => {
          const elapsed = Math.min((now - startedAt) / 1200, 1);
          setProgress(1 - (1 - elapsed) ** 3);

          if (elapsed < 1) animationFrame = requestAnimationFrame(animate);
        };

        animationFrame = requestAnimationFrame(animate);
      },
      { threshold: [0, 0.35] },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="ringkasan"
      className="border-b border-black/10 bg-una-soft"
    >
      <Container>
        <div className="grid grid-cols-2 divide-x divide-y divide-black/10 md:grid-cols-4 md:divide-y-0">
          {stats.map((stat) => (
            <div key={stat.label} className="px-4 py-6 sm:px-6 sm:py-7">
              <p
                aria-label={`${stat.prefix ?? ""}${stat.value}${stat.accent ?? ""}`}
                className="font-heading text-3xl font-extrabold leading-none tracking-[-0.03em] text-primary sm:text-4xl"
              >
                <span aria-hidden="true">
                  {stat.prefix}
                  <span className={stat.accentValue ? "text-[#b77900]" : ""}>
                    {getAnimatedStatValue(stat.value, progress)}
                  </span>
                  {stat.accent && (
                    <span className="text-[#b77900]">{stat.accent}</span>
                  )}
                </span>
              </p>
              <p className="mt-2 text-sm font-semibold leading-5 text-una-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
