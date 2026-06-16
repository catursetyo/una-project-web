import type { Metadata } from "next";
import Link from "next/link";
import { WhatsAppButton } from "@/src/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Konsultasi | UNA Project",
  description:
    "Konsultasikan kebutuhan jam digital, jam waktu sholat, running text LED, dan produk custom UNA Project.",
};

const contactTopics = [
  {
    title: "Konsultasi Produk",
    description:
      "Ceritakan kebutuhan produk, lokasi pemasangan, ukuran, dan fitur yang ingin ditampilkan.",
  },
  {
    title: "Estimasi Harga",
    description:
      "Diskusikan spesifikasi awal agar estimasi harga lebih sesuai dengan kebutuhan dan ukuran produk.",
  },
  {
    title: "Panduan Penggunaan",
    description:
      "Tanyakan penggunaan dasar, setting produk, atau kendala awal setelah produk diterima.",
  },
];

export default function ContactPage() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="scroll-reveal" data-scroll-reveal="left">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-primary">
              Konsultasi
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-zinc-950 sm:text-5xl">
              Konsultasikan kebutuhan produk UNA Project
            </h1>
            <p className="mt-5 text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8">
              Hubungi UNA Project untuk kebutuhan jam waktu sholat digital,
              running text LED, dan produk custom untuk masjid, mushola,
              sekolah, kantor, atau instansi.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <WhatsAppButton />
              <Link
                href="/products"
                className="motion-button inline-flex items-center justify-center rounded-xl border-2 border-primary px-5 py-3.5 text-sm font-black tracking-[0.08em] text-primary hover:bg-primary hover:text-white sm:text-base"
              >
                Lihat Katalog
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {contactTopics.map((topic, index) => (
              <article
                key={topic.title}
                data-scroll-reveal="right"
                data-scroll-delay={(index + 1) * 100}
                className="scroll-reveal motion-card rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl shadow-primary/5 sm:p-6"
              >
                <h2 className="text-xl font-black text-zinc-950 sm:text-2xl">
                  {topic.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-zinc-600 sm:text-base sm:leading-7">
                  {topic.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
