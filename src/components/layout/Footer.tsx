import Link from "next/link";
import { homeNavigationItems } from "@/src/data/navigation";
import { createWhatsAppLink } from "@/src/lib/whatsapp";
import { Container } from "@/src/components/layout/Container";
import { LogoMark } from "@/src/components/ui/LogoMark";

const infoLinks = [
  { label: "Cara Transaksi", href: "/order" },
  { label: "Tutorial Penggunaan", href: "/tutorial" },
  { label: "Lihat Katalog Lengkap", href: "/product" },
  {
    label: "Info Garansi",
    href: createWhatsAppLink({
      message: "Halo UNA Project, saya ingin tanya garansi produk.",
    }),
    external: true,
  },
];

export function Footer() {
  return (
    <footer id="kontak" className="bg-[#060f0d] py-12 text-white/62 sm:py-14 lg:py-16">
      <Container>
        <div className="grid gap-8 border-b border-white/10 pb-8 lg:grid-cols-[1.3fr_1fr_0.8fr_0.9fr]">
          <div>
            <Link href="/#home" className="flex w-fit items-center gap-3">
              <LogoMark size="lg" />
              <span className="leading-tight">
                <span className="block font-heading text-xl font-bold text-white">
                  UNA Project
                </span>
                <span className="block text-[0.66rem] font-bold uppercase tracking-[0.12em] text-una-gold-light">
                  Jam Waktu Sholat Digital
                </span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/55">
              Produsen jam waktu sholat digital, running text LED, JWS RGB,
              Android TV, dan display custom untuk masjid, mushola, kantor,
              serta instansi.
            </p>
          </div>

          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.12em] text-una-gold-light">
              Kontak
            </h2>
            <div className="mt-4 space-y-2.5 text-sm leading-6">
              <p>Temanggung, Jawa Tengah</p>
              <p>+62 812-1545-2519</p>
              <p>unaprojectofficial@gmail.com</p>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.12em] text-una-gold-light">
              Navigasi
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {homeNavigationItems.slice(0, 5).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-una-gold-light"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.12em] text-una-gold-light">
              Informasi
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {infoLinks.map((item) => (
                <li key={item.label}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="transition-colors hover:text-una-gold-light"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="transition-colors hover:text-una-gold-light"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 text-xs text-white/35">
          <p>(c) 2026 UNA Project - Jam Waktu Sholat Digital.</p>
        </div>
      </Container>
    </footer>
  );
}
