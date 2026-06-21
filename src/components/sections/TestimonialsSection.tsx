import { testimonialPlaceholders } from "@/src/data/landing";
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

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonialPlaceholders.map((testimonial, index) => (
            <figure
              key={testimonial.title}
              data-scroll-reveal="scale"
              data-scroll-delay={(index + 1) * 80}
              className="scroll-reveal overflow-hidden rounded-lg border border-black/10 bg-white"
            >
              <div
                role="img"
                aria-label={`${testimonial.title}: ${testimonial.description}`}
                className="relative aspect-[4/3] overflow-hidden bg-[linear-gradient(135deg,#eef2ea_0%,#ffffff_45%,#dfe8df_100%)]"
              >
                <div className="led-dot-grid absolute inset-0 opacity-[0.18]" />
                <div className="absolute inset-5 rounded-lg border border-una-emerald/15 bg-white/70 p-4 shadow-[0_4px_8px_rgb(21_90_76_/_8%)]">
                  <div className="flex h-full flex-col justify-between">
                    <div className="flex items-center justify-between gap-3">
                      <span className="h-2.5 w-20 rounded-full bg-una-emerald/18" />
                      <span className="h-2.5 w-10 rounded-full bg-una-gold/40" />
                    </div>
                    <div className="grid place-items-center gap-3 text-center">
                      <div className="grid size-16 place-items-center rounded-lg border border-dashed border-una-emerald/35 bg-una-soft text-una-emerald">
                        <svg
                          className="size-7"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <rect
                            x="4"
                            y="5"
                            width="16"
                            height="14"
                            rx="2"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          />
                          <path
                            d="m7 16 3.2-3.2a1.3 1.3 0 0 1 1.8 0L15 16m-1.4-1.4 1.2-1.2a1.3 1.3 0 0 1 1.8 0L18 14.8M8.5 9.5h.01"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-heading text-lg font-extrabold text-una-ink">
                          {testimonial.title}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-una-muted">
                          {testimonial.description}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="block h-2 rounded-full bg-una-emerald/12" />
                      <span className="block h-2 w-2/3 rounded-full bg-una-emerald/12" />
                    </div>
                  </div>
                </div>
              </div>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
