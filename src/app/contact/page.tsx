import type { Metadata } from "next";
import Link from "next/link";
import { WhatsAppButton } from "@/src/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Kontak | UNA Project",
  description:
    "Hubungi UNA Project untuk konsultasi jam digital, jam waktu sholat, running text LED, dan produk custom.",
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

const topicDelayClasses = [
  "animate-delay-100",
  "animate-delay-200",
  "animate-delay-300",
];

export default function ContactPage() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="animate-fade-up">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Kontak
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-zinc-950 sm:text-5xl">
              Konsultasikan kebutuhan produk UNA Project
            </h1>
            <p className="mt-5 text-base leading-7 text-zinc-600">
              Hubungi UNA Project untuk kebutuhan jam waktu sholat digital,
              running text LED, dan produk custom untuk masjid, mushola,
              sekolah, kantor, atau instansi.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <WhatsAppButton />
              <Link
                href="/products"
                className="motion-button inline-flex items-center justify-center rounded-xl border-2 border-primary px-6 py-4 text-sm font-bold tracking-[0.12em] text-primary hover:bg-primary hover:text-white"
              >
                Lihat Katalog
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {contactTopics.map((topic, index) => (
              <article
                key={topic.title}
                className={`motion-card animate-fade-up rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl shadow-primary/5 ${
                  topicDelayClasses[index]
                }`}
              >
                <h2 className="text-xl font-black text-zinc-950">
                  {topic.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
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
