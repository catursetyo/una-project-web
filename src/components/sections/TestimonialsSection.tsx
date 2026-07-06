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
          Testimoni
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <article
              key={`${testimonial.title}-${index}`}
              data-scroll-reveal="scale"
              data-scroll-delay={(index + 1) * 80}
              className="scroll-reveal overflow-hidden rounded-xl border border-primary/10 bg-white shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="led-dot-grid relative grid aspect-[16/10] place-items-center overflow-hidden bg-una-deep text-una-gold-light">
                {testimonial.imageUrl ? (
                  <img
                    src={testimonial.imageUrl}
                    alt={testimonial.imageAlt}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    role="img"
                    aria-label={testimonial.imageAlt}
                    className="flex flex-col items-center gap-2 p-4 text-center"
                  >
                    <Icon name="panel" className="size-8 opacity-80" />
                    <span className="text-xs font-bold font-mono tracking-wider">
                      Dokumentasi UNA Project
                    </span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-heading text-lg font-extrabold text-una-ink">
                  {testimonial.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-una-muted">
                  {testimonial.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
