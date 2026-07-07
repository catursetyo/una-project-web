"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { Icon } from "@/src/components/ui/Icon";
import type { PublicTestimonial } from "@/src/lib/publicApi";

type TestimonialsCarouselProps = {
  testimonials: PublicTestimonial[];
};

export function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = testimonials[activeIndex];

  if (!active) return null;

  function move(delta: number) {
    setActiveIndex((current) => (current + delta + testimonials.length) % testimonials.length);
  }

  return (
    <div className="mt-8">
      <article className="grid overflow-hidden rounded-xl border border-primary/10 bg-white shadow-sm md:grid-cols-[1fr_1.1fr]">
        <div className="led-dot-grid relative grid aspect-[16/10] place-items-center overflow-hidden bg-una-deep text-una-gold-light md:aspect-auto">
          {active.imageUrl ? (
            <img src={active.imageUrl} alt={active.imageAlt} className="h-full w-full object-cover" />
          ) : (
            <div role="img" aria-label={active.imageAlt} className="flex flex-col items-center gap-2 p-4 text-center">
              <Icon name="panel" className="size-10 opacity-80" />
              <span className="font-mono text-xs font-bold tracking-wider">Dokumentasi UNA Project</span>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between p-5 sm:p-7">
          <div>
            <h3 className="font-heading text-2xl font-extrabold text-una-ink">{active.title}</h3>
            <p className="mt-3 text-sm leading-6 text-una-muted sm:text-base sm:leading-7">
              {active.description}
            </p>
          </div>

          <div className="mt-6 flex items-center gap-2">
            <button
              type="button"
              onClick={() => move(-1)}
              className="grid size-10 place-items-center rounded-full border border-primary/15 text-primary hover:bg-primary hover:text-white"
              aria-label="Testimoni sebelumnya"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              className="grid size-10 place-items-center rounded-full border border-primary/15 text-primary hover:bg-primary hover:text-white"
              aria-label="Testimoni berikutnya"
            >
              →
            </button>
          </div>
        </div>
      </article>

      <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
        {testimonials.map((testimonial, index) => (
          <button
            key={`${testimonial.title}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-pressed={activeIndex === index}
            className={`min-w-[220px] rounded-lg border p-3 text-left transition-colors ${
              activeIndex === index
                ? "border-primary bg-primary text-white"
                : "border-primary/10 bg-white text-una-ink hover:border-primary/30"
            }`}
          >
            <span className="block truncate text-sm font-black">{testimonial.title}</span>
            <span className={`mt-1 block line-clamp-2 text-xs ${activeIndex === index ? "text-white/75" : "text-una-muted"}`}>
              {testimonial.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
