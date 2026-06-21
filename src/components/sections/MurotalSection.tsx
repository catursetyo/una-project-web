import { murotalBenefits } from "@/src/data/landing";
import { createWhatsAppLink } from "@/src/lib/whatsapp";
import { Button } from "@/src/components/ui/Button";
import { Icon } from "@/src/components/ui/Icon";
import { SectionLabel } from "@/src/components/ui/SectionLabel";
import { Container } from "@/src/components/layout/Container";

const waveHeights = [40, 70, 100, 55, 90, 30, 65, 85, 45, 75, 100, 55];

export function MurotalSection() {
  return (
    <section
      id="murotal"
      className="relative overflow-hidden bg-una-emerald py-16 text-white sm:py-20 lg:py-24"
    >
      <div className="islamic-star-pattern absolute inset-0 opacity-[0.04]" />
      <Container className="relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.82fr] lg:gap-16">
          <div data-scroll-reveal="left" className="scroll-reveal">
            <SectionLabel tone="dark">Fitur Auto-Murotal</SectionLabel>
            <h2 className="mt-5 max-w-2xl font-heading text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              Suasana masjid yang lebih hidup menjelang azan
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/70">
              Beberapa menit menjelang azan, JWS dapat memutar murotal pilihan
              secara otomatis agar jamaah mendapat pengingat tanpa perlu
              menyalakan perangkat manual.
            </p>
            <ul className="mt-7 space-y-4">
              {murotalBenefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex gap-3 text-sm leading-6 text-white/80"
                >
                  <Icon
                    name="shield"
                    className="mt-0.5 size-5 shrink-0 text-una-gold-light"
                  />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button
                href={createWhatsAppLink({
                  message:
                    "Halo UNA Project, saya ingin tahu fitur auto-murotal JWS Digital.",
                })}
                target="_blank"
                variant="gold"
              >
                Tanya Soal Murotal
              </Button>
            </div>
          </div>

          <div
            data-scroll-reveal="scale"
            className="scroll-reveal rounded-lg border border-white/15 bg-white/5 p-8"
          >
            <div className="flex h-28 items-center justify-center gap-2">
              {waveHeights.map((height, index) => (
                <span
                  key={`${height}-${index}`}
                  className="animate-wave wave-bar block w-1.5 rounded-full"
                  style={{
                    height: `${height}%`,
                    animationDelay: `${index * 0.1}s`,
                  }}
                />
              ))}
            </div>
            <p className="mt-6 text-center text-xs font-black uppercase tracking-[0.14em] text-white/45">
              Pemutaran murotal otomatis
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
