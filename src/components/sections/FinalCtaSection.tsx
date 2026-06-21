import { createWhatsAppLink } from "@/src/lib/whatsapp";
import { Button } from "@/src/components/ui/Button";
import { Icon } from "@/src/components/ui/Icon";
import { SectionLabel } from "@/src/components/ui/SectionLabel";
import { Container } from "@/src/components/layout/Container";

export function FinalCtaSection() {
  return (
    <section className="relative overflow-hidden bg-una-deep py-16 text-white sm:py-20">
      <div className="islamic-star-pattern absolute inset-0 opacity-[0.04]" />
      <Container className="relative z-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl">
            <SectionLabel tone="dark">Siap Pasang Sekarang?</SectionLabel>
            <h2 className="mt-5 font-heading text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              Pasang Jam Waktu Sholat Digital di masjid Anda
            </h2>
            <p className="mt-4 text-base leading-8 text-white/68">
              Konsultasi gratis. UNA Project bantu pilih tipe yang paling
              sesuai kebutuhan, lokasi, dan anggaran pemasangan.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Button
              href={createWhatsAppLink({
                message:
                  "Assalamualaikum, saya ingin konsultasi pemasangan JWS Digital UNA Project.",
              })}
              target="_blank"
              variant="gold"
            >
              <Icon name="whatsapp" className="size-5" />
              Hubungi via WhatsApp
            </Button>
            <Button href="/#produk" variant="outlineLight">
              Lihat Katalog
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
