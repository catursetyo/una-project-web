import { heroTrustItems } from "@/src/data/landing";
import { createWhatsAppLink } from "@/src/lib/whatsapp";
import { Button } from "@/src/components/ui/Button";
import { Icon } from "@/src/components/ui/Icon";
import { JwsDisplayMockup } from "@/src/components/ui/JwsDisplayMockup";
import { SectionLabel } from "@/src/components/ui/SectionLabel";
import { Container } from "@/src/components/layout/Container";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-una-deep py-16 text-white sm:py-20 lg:py-24"
    >
      <div className="islamic-star-pattern absolute inset-0 opacity-[0.045]" />
      <Container className="relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.95fr] lg:gap-14">
          <div>
            <SectionLabel tone="dark">
              Jam Waktu Sholat Digital - Akurasi GPS
            </SectionLabel>
            <h1 className="mt-6 max-w-3xl font-heading text-[clamp(2.65rem,8vw,4.65rem)] font-extrabold leading-[0.98] tracking-[-0.025em] text-white">
              Waktu sholat yang{" "}
              <span className="text-una-gold-light">menyala presisi</span> di
              masjid Anda
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
              UNA Project menghadirkan jadwal sholat digital untuk masjid,
              mushola, dan kantor: akurasi GPS otomatis, mudah diatur dari
              smartphone, dan tersedia pilihan auto-murotal.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                href={createWhatsAppLink({
                  message:
                    "Assalamualaikum, saya ingin pesan Jam Waktu Sholat Digital UNA Project.",
                })}
                target="_blank"
                variant="gold"
              >
                <Icon name="whatsapp" className="size-5" />
                Pesan via WhatsApp
              </Button>
              <Button href="/#produk" variant="outlineLight">
                Lihat Katalog
              </Button>
            </div>

            <div className="mt-10 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-2 xl:grid-cols-4">
              {heroTrustItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 text-sm font-semibold text-white/70"
                >
                  <Icon
                    name={item.icon}
                    className="size-4 shrink-0 text-una-gold-light"
                  />
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          <div data-scroll-reveal="scale" className="scroll-reveal">
            <JwsDisplayMockup />
          </div>
        </div>
      </Container>
    </section>
  );
}
