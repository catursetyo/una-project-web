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
        <div className="grid min-w-0 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-14">
          <div className="min-w-0">
            <SectionLabel tone="dark">
              Jam Waktu Sholat Digital - Akurasi GPS
            </SectionLabel>
            <h1 className="mt-6 max-w-3xl font-heading text-[clamp(2.35rem,11vw,4.65rem)] font-extrabold leading-[1.02] tracking-[-0.025em] text-white sm:leading-[0.98]">
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

          </div>

          <div
            data-scroll-reveal="scale"
            className="scroll-reveal min-w-0 overflow-hidden"
          >
            <JwsDisplayMockup />
          </div>
        </div>
      </Container>
    </section>
  );
}
