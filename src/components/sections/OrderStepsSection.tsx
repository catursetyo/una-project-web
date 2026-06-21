import { orderSteps } from "@/src/data/landing";
import { createWhatsAppLink } from "@/src/lib/whatsapp";
import { Button } from "@/src/components/ui/Button";
import { Icon } from "@/src/components/ui/Icon";
import { SectionLabel } from "@/src/components/ui/SectionLabel";
import { Container } from "@/src/components/layout/Container";

export function OrderStepsSection() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <Container>
        <div
          data-scroll-reveal
          className="scroll-reveal mx-auto max-w-2xl text-center"
        >
          <SectionLabel>Alur Pemesanan</SectionLabel>
          <h2 className="mt-5 font-heading text-3xl font-extrabold leading-tight text-una-ink sm:text-4xl">
            Tiga langkah, tanpa ribet
          </h2>
          <p className="mt-4 text-base leading-8 text-una-muted">
            Dari konsultasi sampai produk aktif di lokasi, alurnya dibuat jelas
            agar pengurus mudah mengambil keputusan.
          </p>
        </div>

        <div className="mt-12 grid overflow-hidden rounded-lg border border-black/10 lg:grid-cols-3">
          {orderSteps.map((step, index) => (
            <article
              key={step.number}
              data-scroll-reveal="scale"
              data-scroll-delay={(index + 1) * 80}
              className="scroll-reveal border-b border-black/10 p-7 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
            >
              <div className="grid size-10 place-items-center rounded-full bg-una-deep font-heading text-sm font-extrabold text-una-gold-light">
                {step.number}
              </div>
              <h3 className="mt-6 text-xl font-extrabold text-una-ink">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-una-muted">
                {step.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
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
