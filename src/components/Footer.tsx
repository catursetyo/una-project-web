import Link from "next/link";
import { homeNavigationItems } from "@/src/data/navigation";
import { createWhatsAppLink } from "@/src/lib/whatsapp";
import { Container } from "@/src/components/layout/Container";
import { Icon } from "@/src/components/ui/Icon";
import { LogoMark } from "@/src/components/ui/LogoMark";

const infoLinks = [
  { label: "Cara Transaksi", href: "/order" },
  { label: "Tutorial Penggunaan", href: "/tutorial" },
  { label: "Katalog Lengkap", href: "/products" },
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
    <footer id="kontak" className="bg-[#060f0d] py-16 text-white/62 sm:py-20">
      <Container>
        <div className="grid gap-10 border-b border-white/10 pb-12 lg:grid-cols-[1.3fr_1fr_0.8fr_0.9fr]">
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
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/48">
              Produsen jam waktu sholat digital, running text LED, JWS RGB,
              Android TV, dan display custom untuk masjid, mushola, kantor,
              serta instansi.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { label: "Instagram", href: "#" },
                { label: "YouTube", href: "#" },
                {
                  label: "WhatsApp",
                  href: createWhatsAppLink({
                    message:
                      "Assalamualaikum, saya ingin tanya produk UNA Project.",
                  }),
                },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href === "#" ? undefined : "_blank"}
                  rel={item.href === "#" ? undefined : "noreferrer"}
                  aria-label={item.label}
                  className="grid size-9 place-items-center rounded-full border border-white/12 text-white/72 transition-colors hover:border-white/25 hover:bg-white/10 hover:text-una-gold-light"
                >
                  {item.label === "WhatsApp" ? (
                    <Icon name="whatsapp" className="size-4" />
                  ) : (
                    <span className="text-xs font-black">
                      {item.label.slice(0, 2)}
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.12em] text-una-gold-light">
              Kontak
            </h2>
            <div className="mt-5 space-y-3 text-sm leading-6">
              <p>Temanggung, Jawa Tengah</p>
              <p>+62 812-3456-7890</p>
              <p>unaprojectofficial@gmail.com</p>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.12em] text-una-gold-light">
              Navigasi
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
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
            <ul className="mt-5 space-y-3 text-sm">
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

        <div className="flex flex-col gap-3 pt-6 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>(c) 2026 UNA Project - Jam Waktu Sholat Digital.</p>
          <p>Dibuat sebagai portfolio remake website UMKM Indonesia.</p>
        </div>
      </Container>
    </footer>
  );
}
