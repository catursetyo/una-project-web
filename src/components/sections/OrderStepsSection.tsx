import { orderSteps } from "@/src/data/landing";
import { createWhatsAppLink } from "@/src/lib/whatsapp";
import { Button } from "@/src/components/ui/Button";
import { Icon } from "@/src/components/ui/Icon";
import { SectionLabel } from "@/src/components/ui/SectionLabel";
import { Container } from "@/src/components/layout/Container";

export function OrderStepsSection() {
  return (
    <section id="order" className="relative overflow-hidden bg-una-deep py-12 text-white sm:py-14 lg:py-16">
      <div className="islamic-star-pattern absolute inset-0 opacity-[0.04]" />
      <Container className="relative z-10">
        <div
          data-scroll-reveal
          className="scroll-reveal mx-auto max-w-2xl text-center"
        >
          <SectionLabel tone="dark">Alur Pemesanan</SectionLabel>
          <h2 className="mt-3 font-heading text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Tiga langkah, tanpa ribet
          </h2>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {orderSteps.map((step, index) => (
            <article
              key={step.number}
              data-scroll-reveal="scale"
              data-scroll-delay={(index + 1) * 80}
              className="scroll-reveal flex flex-col justify-between rounded-xl border border-white/15 bg-white/[0.06] p-6 backdrop-blur-sm transition-all hover:border-una-gold-light/40 hover:bg-white/[0.1] sm:p-7"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-xl bg-una-gold font-heading text-base font-extrabold text-una-gold-ink shadow-md shadow-una-gold/20">
                    {step.number}
                  </span>
                  <span className="ml-4 h-px flex-1 bg-white/15" />
                </div>
                <h3 className="mt-5 font-heading text-xl font-extrabold text-white sm:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/75 sm:text-base">
                  {step.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button
            href={createWhatsAppLink({
              message:
                "Assalamualaikum, saya ingin konsultasi pemasangan JWS Digital UNA Project.",
            })}
            target="_blank"
            variant="gold"
          >
            <Icon name="whatsapp" className="size-5" />
            Mulai Konsultasi
          </Button>
        </div>
      </Container>
    </section>
  );
}
