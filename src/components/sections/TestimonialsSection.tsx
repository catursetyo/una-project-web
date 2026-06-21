import { testimonials } from "@/src/data/landing";
import { Icon } from "@/src/components/ui/Icon";
import { SectionLabel } from "@/src/components/ui/SectionLabel";
import { Container } from "@/src/components/layout/Container";

export function TestimonialsSection() {
  return (
    <section id="testimoni" className="bg-una-soft py-16 sm:py-20 lg:py-24">
      <Container>
        <div
          data-scroll-reveal
          className="scroll-reveal mx-auto max-w-2xl text-center"
        >
          <SectionLabel>Testimoni</SectionLabel>
          <h2 className="mt-5 font-heading text-3xl font-extrabold leading-tight text-una-ink sm:text-4xl">
            Dipercaya pengurus masjid dan mushola
          </h2>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <article
              key={testimonial.name}
              data-scroll-reveal="scale"
              data-scroll-delay={(index + 1) * 80}
              className="scroll-reveal rounded-lg border border-black/10 bg-white p-6"
            >
              <div className="flex gap-1 text-una-gold">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Icon
                    key={starIndex}
                    name="star"
                    className="size-4"
                  />
                ))}
              </div>
              <p className="mt-5 text-base leading-8 text-una-ink">
                &quot;{testimonial.quote}&quot;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-full bg-una-emerald font-heading text-sm font-extrabold text-una-gold-light">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="font-bold text-una-ink">{testimonial.name}</p>
                  <p className="mt-0.5 text-sm text-una-muted">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
