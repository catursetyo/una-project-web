import { testimonials } from "@/src/data/landing";
import { Icon } from "@/src/components/ui/Icon";
import { Container } from "@/src/components/layout/Container";

export function TestimonialsSection() {
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
              key={testimonial.title}
              data-scroll-reveal="scale"
              data-scroll-delay={(index + 1) * 80}
              className="scroll-reveal overflow-hidden rounded-lg border border-primary/10 bg-white transition-colors hover:border-primary/25"
            >
              <div
                role="img"
                aria-label={testimonial.imageAlt}
                className="led-dot-grid grid aspect-[16/10] place-items-center bg-una-deep text-una-gold-light"
              >
                <div className="flex flex-col items-center gap-2">
                  <Icon name="panel" className="size-8" />
                  <span className="text-xs font-bold">Placeholder foto</span>
                </div>
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
