/* eslint-disable @next/next/no-img-element */
import { getPublicTestimonials } from "@/src/lib/publicApi";
import { Icon } from "@/src/components/ui/Icon";
import { Container } from "@/src/components/layout/Container";

export async function TestimonialsSection() {
  const testimonials = await getPublicTestimonials();

  return (
    <section id="testimoni" className="bg-una-soft py-12 sm:py-14 lg:py-16">
      <Container>
        <h2
          data-scroll-reveal
          className="scroll-reveal text-center font-heading text-3xl font-extrabold leading-tight text-una-ink sm:text-4xl"
        >
          Testimoni &amp; Dokumentasi Pemasangan
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <article
              key={`${testimonial.title}-${index}`}
              data-scroll-reveal="scale"
              data-scroll-delay={(index + 1) * 80}
              className="scroll-reveal overflow-hidden rounded-xl border border-primary/10 bg-white shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div
                role="img"
                aria-label={testimonial.imageAlt}
                className="led-dot-grid grid aspect-[16/10] place-items-center bg-una-deep text-una-gold-light relative overflow-hidden"
              >
                {testimonial.imageUrl ? (
                  <img
                    src={testimonial.imageUrl}
                    alt={testimonial.imageAlt}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 p-4 text-center">
                    <Icon name="panel" className="size-8 opacity-80" />
                    <span className="text-xs font-bold font-mono tracking-wider">
                      {testimonial.customer || "Dokumentasi UNA Project"}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-5 flex flex-col justify-between h-fit">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-heading text-lg font-extrabold text-una-ink line-clamp-1">
                      {testimonial.title}
                    </h3>
                    {testimonial.rating ? (
                      <span className="text-amber-500 font-bold text-xs tracking-tighter shrink-0">
                        {"★".repeat(testimonial.rating)}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-una-muted">
                    {testimonial.description}
                  </p>
                </div>
                {testimonial.customer ? (
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-una-deep/80">
                    <span>👤 {testimonial.customer}</span>
                    {testimonial.role && <span className="text-una-muted">{testimonial.role}</span>}
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
