import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-zinc-200 bg-white">
      <div className="mx-auto flex min-h-[620px] max-w-6xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="animate-fade-up rounded-full bg-primary/10 px-5 py-2 text-xs font-bold tracking-[0.22em] text-primary">
          Katalog Produk
        </div>

        <h1 className="animate-fade-up animate-delay-100 mt-8 max-w-4xl text-5xl font-black leading-none text-zinc-950 sm:text-6xl lg:text-7xl">
          UNA Project
        </h1>
        <p className="animate-fade-up animate-delay-200 mt-7 max-w-3xl text-lg leading-8 text-zinc-600">
          Menghadirkan solusi jam waktu sholat digital, running text LED, dan
          produk custom modern untuk masjid, mushola, sekolah, kantor, serta
          instansi Anda.
        </p>

        <div className="animate-fade-up animate-delay-300 mt-10 flex w-full max-w-md flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/products"
            className="motion-button inline-flex items-center justify-center rounded-xl bg-primary px-6 py-4 text-sm font-bold tracking-[0.14em] text-white shadow-xl shadow-primary/20 hover:bg-tertiary"
          >
            Eksplorasi Katalog
          </Link>
          <Link
            href="/order"
            className="motion-button inline-flex items-center justify-center rounded-xl border-2 border-primary px-6 py-4 text-sm font-bold tracking-[0.14em] text-primary hover:bg-primary hover:text-white"
          >
            Konsultasi Pemasangan
          </Link>
        </div>

        <div className="mt-16 grid w-full max-w-4xl gap-4 text-left sm:grid-cols-3">
          {[
            ["Jam Waktu Sholat", "Display jadwal sholat digital untuk masjid."],
            ["Running Text LED", "Informasi berjalan untuk pengumuman harian."],
            ["Produk Custom", "Ukuran dan kebutuhan bisa dikonsultasikan."],
          ].map(([title, description], index) => (
            <div
              key={title}
              className={`motion-card animate-fade-up rounded-2xl border border-white/70 bg-white/75 p-5 shadow-xl shadow-primary/5 backdrop-blur ${
                index === 0
                  ? "animate-delay-300"
                  : index === 1
                    ? "animate-delay-400"
                    : "animate-delay-500"
              }`}
            >
              <p className="text-sm font-bold text-zinc-950">{title}</p>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-48 right-[-160px] size-[420px] rounded-full bg-secondary/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-44 left-[-150px] size-[420px] rounded-full bg-primary/20 blur-3xl"
      />
    </section>
  );
}
