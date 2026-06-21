import { whyFeatures } from "@/src/data/landing";
import { createWhatsAppLink } from "@/src/lib/whatsapp";
import { Button } from "@/src/components/ui/Button";
import { Icon } from "@/src/components/ui/Icon";
import { SectionLabel } from "@/src/components/ui/SectionLabel";
import { Container } from "@/src/components/layout/Container";

export function WhySection() {
  return (
    <section id="keunggulan" className="bg-una-cream py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.45fr] lg:items-start lg:gap-16">
          <div data-scroll-reveal="left" className="scroll-reveal">
            <SectionLabel>Kenapa UNA Project</SectionLabel>
            <h2 className="mt-5 max-w-xl font-heading text-3xl font-extrabold leading-tight text-una-ink sm:text-4xl">
              Dibuat khusus untuk kebutuhan masjid dan mushola
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-una-muted">
              Setiap produk JWS Digital dirancang agar mudah dipasang, mudah
              dirawat, dan tetap akurat tanpa kalibrasi rumit setiap tahun.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                href={createWhatsAppLink({
                  message:
                    "Halo UNA Project, saya ingin konsultasi JWS Digital.",
                })}
                target="_blank"
                variant="dark"
              >
                Konsultasi Gratis
              </Button>
              <Button href="/#produk" variant="outline">
                Lihat Katalog
              </Button>
            </div>
          </div>

          <div className="grid overflow-hidden rounded-lg border border-black/10 bg-black/10 sm:grid-cols-2">
            {whyFeatures.map((feature, index) => (
              <article
                key={feature.title}
                data-scroll-reveal="scale"
                data-scroll-delay={(index + 1) * 80}
                className="scroll-reveal bg-white p-6 sm:p-7"
              >
                <div className="grid size-12 place-items-center rounded-lg bg-una-deep text-una-gold-light">
                  <Icon name={feature.icon} className="size-6" />
                </div>
                <h3 className="mt-5 text-lg font-extrabold text-una-ink">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-una-muted">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
