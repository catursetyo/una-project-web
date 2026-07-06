import { whyFeatures } from "@/src/data/landing";
import { getDynamicWhatsAppLink } from "@/src/lib/publicApi";
import { Button } from "@/src/components/ui/Button";
import { Icon } from "@/src/components/ui/Icon";
import { SectionLabel } from "@/src/components/ui/SectionLabel";
import { Container } from "@/src/components/layout/Container";

export async function WhySection() {
  const waLink = await getDynamicWhatsAppLink({ category: "Konsultasi" });

  return (
    <section id="keunggulan" className="bg-white py-12 sm:py-14 lg:py-16">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.45fr] lg:items-center lg:gap-12">
          <div data-scroll-reveal="left" className="scroll-reveal">
            <SectionLabel>Kenapa UNA Project?</SectionLabel>
            <h2 className="mt-3 max-w-xl font-heading text-3xl font-extrabold leading-tight text-una-ink sm:text-4xl">
              Dibuat khusus untuk kebutuhan masjid dan mushola
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-una-muted">
              Setiap produk JWS Digital dirancang agar mudah dipasang, mudah
              dirawat, dan tetap akurat tanpa kalibrasi rumit setiap tahun.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                href={waLink}
                target="_blank"
                variant="dark"
              >
                Konsultasi Gratis
              </Button>
              <Button href="/product" variant="outline">
                Lihat Katalog Lengkap
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {whyFeatures.map((feature, index) => (
              <article
                key={feature.title}
                data-scroll-reveal="scale"
                data-scroll-delay={(index + 1) * 80}
                className="scroll-reveal rounded-lg border border-primary/10 bg-una-soft p-5 transition-colors hover:border-primary/25 hover:bg-white sm:p-6"
              >
                <div className="grid size-12 place-items-center rounded-lg bg-una-deep text-una-gold-light">
                  <Icon name={feature.icon} className="size-6" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-extrabold text-una-ink">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-una-muted">
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
