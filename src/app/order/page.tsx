import type { Metadata } from "next";
import Link from "next/link";
import { createWhatsAppLink } from "@/src/lib/whatsapp";

export const metadata: Metadata = {
  title: "Cara Pesan | UNA Project",
  description:
    "Panduan alur transaksi manual UNA Project mulai dari pilih produk, konsultasi, pembayaran DP, produksi, instalasi, hingga after-sales.",
};

const orderSteps = [
  {
    title: "Pilih Produk",
    description:
      "Lihat katalog produk dan tentukan jenis kebutuhan awal, misalnya jam waktu sholat, running text LED, atau produk custom.",
  },
  {
    title: "Konsultasi Kebutuhan",
    description:
      "Diskusikan lokasi pemasangan, ukuran, fitur, warna tampilan, serta kebutuhan informasi yang ingin ditampilkan.",
  },
  {
    title: "Konfirmasi Ukuran dan Harga",
    description:
      "UNA Project membantu menghitung estimasi harga berdasarkan ukuran, bahan, fitur, dan kebutuhan pemasangan.",
  },
  {
    title: "Pembayaran DP",
    description:
      "Setelah spesifikasi disepakati, customer melakukan pembayaran DP sebagai tanda mulai proses produksi.",
  },
  {
    title: "Proses Produksi",
    description:
      "Produk dibuat sesuai spesifikasi yang sudah disepakati. Lama produksi menyesuaikan tingkat custom dan antrean pekerjaan.",
  },
  {
    title: "Instalasi atau Pengiriman",
    description:
      "Produk dikirim atau dipasang sesuai kesepakatan. Untuk produk tertentu, proses setting awal dapat dibantu.",
  },
  {
    title: "Garansi dan After-Sales",
    description:
      "Setelah produk diterima, customer tetap bisa berkonsultasi untuk penggunaan, setting, dan kendala dasar.",
  },
];

export default function OrderPage() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Transaksi
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-zinc-950 sm:text-5xl">
            Alur pemesanan UNA Project
          </h1>
          <p className="mt-5 text-base leading-7 text-zinc-600">
            Transaksi masih dilakukan secara manual melalui
            konsultasi WhatsApp. Website berfungsi sebagai katalog dan panduan
            agar calon customer lebih mudah memahami proses pemesanan.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {orderSteps.map((step, index) => (
            <article
              key={step.title}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl shadow-primary/5"
            >
              <div className="flex items-start gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-white">
                  {index + 1}
                </span>
                <div>
                  <h2 className="text-xl font-black text-zinc-950">
                    {step.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">
                    {step.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-primary/20 bg-white p-6 text-center shadow-xl shadow-primary/5 sm:p-8">
          <h2 className="text-2xl font-black text-zinc-950">
            Sudah tahu kebutuhan produk?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
            Mulai dari konsultasi dulu. Kamu bisa membawa informasi ukuran,
            lokasi pemasangan, dan contoh tampilan yang diinginkan agar proses
            estimasi lebih cepat.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={createWhatsAppLink()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-4 text-sm font-bold tracking-[0.12em] text-white transition-colors hover:bg-tertiary"
            >
              Konsultasi via WhatsApp
            </a>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-xl border-2 border-primary px-6 py-4 text-sm font-bold tracking-[0.12em] text-primary transition-colors hover:bg-primary hover:text-white"
            >
              Lihat Katalog
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
