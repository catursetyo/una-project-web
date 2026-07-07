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
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const hasMultipleItems = testimonials.length > 1;
  const active = testimonials[activeIndex];
  const previous = hasMultipleItems
    ? testimonials[(activeIndex - 1 + testimonials.length) % testimonials.length]
    : undefined;
  const next = hasMultipleItems ? testimonials[(activeIndex + 1) % testimonials.length] : undefined;

  if (!active) return null;

  function move(delta: number) {
    if (!hasMultipleItems) return;
    setDirection(delta > 0 ? "next" : "prev");
    setActiveIndex((current) => (current + delta + testimonials.length) % testimonials.length);
  }

  function goTo(index: number) {
    if (index === activeIndex) return;
    setDirection(index > activeIndex ? "next" : "prev");
    setActiveIndex(index);
  }

  return (
    <div className="mt-8 sm:mt-10">
      <div className="relative mx-auto grid max-w-6xl items-center gap-4 md:grid-cols-[0.78fr_1.18fr_0.78fr] md:gap-5">
        {previous ? (
          <CarouselCard testimonial={previous} muted onClick={() => move(-1)} />
        ) : null}

        <div key={activeIndex} data-carousel-direction={direction} className="testimonial-card-in relative z-10">
          {hasMultipleItems ? (
            <button
              type="button"
              onClick={() => move(-1)}
              className="motion-button absolute left-3 top-[32%] z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-una-deep p-0 text-white shadow-md hover:bg-una-gold hover:text-una-gold-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-una-gold sm:top-[34%]"
              aria-label="Testimoni sebelumnya"
            >
              <svg className="size-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m15 6-6 6 6 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ) : null}
          <CarouselCard testimonial={active} active />
          {hasMultipleItems ? (
            <button
              type="button"
              onClick={() => move(1)}
              className="motion-button absolute right-3 top-[32%] z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-una-deep p-0 text-white shadow-md hover:bg-una-gold hover:text-una-gold-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-una-gold sm:top-[34%]"
              aria-label="Testimoni berikutnya"
            >
              <svg className="size-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ) : null}
        </div>

        {next ? (
          <CarouselCard testimonial={next} muted onClick={() => move(1)} />
        ) : null}
      </div>

      {hasMultipleItems ? (
        <div className="mt-5 flex justify-center gap-2">
          {testimonials.map((testimonial, index) => (
            <button
              key={`${testimonial.title}-${index}`}
              type="button"
              onClick={() => goTo(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                index === activeIndex ? "w-7 bg-primary" : "w-2.5 bg-primary/20 hover:bg-primary/45"
              }`}
              aria-label={`Lihat testimoni ${index + 1}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function CarouselCard({
  testimonial,
  active = false,
  muted = false,
  onClick,
}: {
  testimonial: PublicTestimonial;
  active?: boolean;
  muted?: boolean;
  onClick?: () => void;
}) {
  const content = (
    <div
      className={`overflow-hidden rounded-2xl border border-primary/10 bg-white transition-all duration-300 ease-out ${
        active ? "shadow-lg shadow-primary/10" : "md:scale-[0.86] md:opacity-70 md:hover:scale-[0.9] md:hover:opacity-95"
      } ${muted ? "hidden md:block" : ""}`}
    >
      <div className="led-dot-grid relative grid aspect-[16/10] place-items-center overflow-hidden bg-una-deep text-una-gold-light">
        {testimonial.imageUrl ? (
          <img src={testimonial.imageUrl} alt={testimonial.imageAlt} className="h-full w-full object-cover" />
        ) : (
          <div
            role="img"
            aria-label={testimonial.imageAlt}
            className="flex flex-col items-center gap-2 p-4 text-center"
          >
            <span className="grid size-11 place-items-center rounded-full bg-una-gold/10 ring-1 ring-una-gold/30">
              <Icon name="panel" className="size-6 opacity-90" />
            </span>
            <span className="font-led text-base tracking-[0.12em]">Dokumentasi UNA Project</span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgb(10_33_29_/_0.08)_55%,rgb(10_33_29_/_0.34)_100%)]" />
      </div>
      <p
        className={`line-clamp-3 bg-white ${
          active ? "p-5 text-base leading-7 text-una-ink" : "p-4 text-sm leading-6 text-una-muted"
        }`}
      >
        {testimonial.description}
      </p>
    </div>
  );

  if (!onClick) return content;

  return (
    <button
      type="button"
      onClick={onClick}
      className="hidden text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:block"
      aria-label="Pilih testimoni"
    >
      {content}
    </button>
  );
}
