import type { Metadata } from "next";
import Link from "next/link";
import { WhatsAppButton } from "@/src/components/ui/WhatsAppButton";
import { getTransactionOrderSteps } from "@/src/lib/publicApi";

export const metadata: Metadata = {
  title: "Cara Pesan | UNA Project",
  description:
    "Panduan alur transaksi manual UNA Project mulai dari pilih produk, konsultasi, pembayaran DP, produksi, instalasi, hingga after-sales.",
};

export default async function OrderPage() {
  const orderSteps = await getTransactionOrderSteps();

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div
          className="scroll-reveal mx-auto max-w-3xl text-center"
          data-scroll-reveal
        >
          <p className="text-sm font-black uppercase tracking-[0.14em] text-primary">
            Transaksi
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-zinc-950 sm:text-5xl">
            Alur pemesanan UNA Project
          </h1>
          <p className="mt-5 text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8">
            Transaksi masih dilakukan secara manual melalui
            konsultasi WhatsApp. Website berfungsi sebagai katalog dan panduan
            agar calon customer lebih mudah memahami proses pemesanan.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {orderSteps.map((step, index) => (
            <article
              key={step.title}
              data-scroll-reveal="scale"
              data-scroll-delay={(index % 5) * 80}
              className="scroll-reveal motion-card rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl shadow-primary/5 sm:p-6"
            >
              <div className="flex items-start gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-white">
                  {index + 1}
                </span>
                <div>
                  <h2 className="text-xl font-black text-zinc-950 sm:text-2xl">
                    {step.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-zinc-600 sm:text-base sm:leading-7">
                    {step.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div
          className="scroll-reveal motion-card mt-12 rounded-2xl border border-primary/20 bg-white p-5 text-center shadow-xl shadow-primary/5 sm:p-8"
          data-scroll-reveal="scale"
        >
          <h2 className="text-2xl font-black text-zinc-950 sm:text-3xl">
            Sudah tahu kebutuhan produk?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base sm:leading-7">
            Mulai dari konsultasi dulu. Kamu bisa membawa informasi ukuran,
            lokasi pemasangan, dan contoh tampilan yang diinginkan agar proses
            estimasi lebih cepat.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <WhatsAppButton category="Konsultasi" />
            <Link
              href="/product"
              className="motion-button inline-flex items-center justify-center rounded-xl border-2 border-primary px-5 py-3.5 text-sm font-black tracking-[0.08em] text-primary hover:bg-primary hover:text-white sm:text-base"
            >
              Lihat Katalog Lengkap
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
