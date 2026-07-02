import type { Metadata } from "next";
import Link from "next/link";
import { WhatsAppButton } from "@/src/components/ui/WhatsAppButton";

export const metadata: Metadata = {
  title: "Tentang UNA Project | UNA Project",
  description:
    "Tentang UNA Project, penyedia jam waktu sholat digital, running text LED, dan produk custom untuk masjid, mushola, sekolah, kantor, dan instansi.",
};

const services = [
  "Jam waktu sholat digital",
  "Running text LED",
  "Jam digital custom",
  "Produk display untuk masjid, sekolah, kantor, dan instansi",
];

const principles = [
  {
    title: "Kebutuhan dibahas dari awal",
    description:
      "Setiap produk dimulai dari diskusi kebutuhan tempat, ukuran, tampilan, dan cara penggunaan harian.",
  },
  {
    title: "Produk dibuat agar mudah dipakai",
    description:
      "Tampilan dan fitur diarahkan supaya informasi mudah dibaca serta tidak menyulitkan pengguna saat setting.",
  },
  {
    title: "Komunikasi tetap sederhana",
    description:
      "Proses konsultasi, konfirmasi harga, produksi, dan after-sales dilakukan secara jelas melalui komunikasi langsung.",
  },
];

export default function AboutPage() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <div className="scroll-reveal" data-scroll-reveal="left">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-primary">
              Tentang UNA Project
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-zinc-950 sm:text-5xl">
              Solusi display digital untuk kebutuhan informasi harian
            </h1>
            <p className="mt-5 text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8">
              UNA Project membantu membuat produk jam digital, jam waktu sholat,
              running text LED, dan display custom untuk tempat ibadah,
              sekolah, kantor, toko, serta instansi yang membutuhkan tampilan
              informasi yang jelas.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <WhatsAppButton />
              <Link
                href="/products"
                className="motion-button inline-flex items-center justify-center rounded-xl border-2 border-primary px-5 py-3.5 text-sm font-black tracking-[0.08em] text-primary hover:bg-primary hover:text-white sm:text-base"
              >
                Lihat Produk
              </Link>
            </div>
          </div>

          <div
            className="scroll-reveal motion-card rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl shadow-primary/5 sm:p-8"
            data-scroll-reveal="right"
            data-scroll-delay={160}
          >
            <h2 className="text-2xl font-black text-zinc-950 sm:text-3xl">
              Layanan Utama
            </h2>
            <ul className="mt-6 space-y-4">
              {services.map((service) => (
                <li
                  key={service}
                  className="flex gap-3 text-sm text-zinc-700 sm:text-base"
                >
                  <span
                    aria-hidden="true"
                    className="mt-1.5 size-2 rounded-full bg-primary"
                  />
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {principles.map((principle, index) => (
            <article
              key={principle.title}
              data-scroll-reveal="scale"
              data-scroll-delay={(index + 1) * 90}
              className="scroll-reveal motion-card rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl shadow-primary/5 sm:p-6"
            >
              <h2 className="text-xl font-black text-zinc-950 sm:text-2xl">
                {principle.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600 sm:text-base sm:leading-7">
                {principle.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
