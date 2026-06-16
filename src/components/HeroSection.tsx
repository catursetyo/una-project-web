import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-zinc-200 bg-white">
      <div className="mx-auto flex min-h-[520px] max-w-6xl flex-col items-center justify-center px-4 py-16 text-center sm:min-h-[620px] sm:px-6 sm:py-20 lg:px-8">
        <div className="animate-fade-up rounded-full bg-primary/10 px-4 py-2 text-xs font-black tracking-[0.16em] text-primary sm:text-sm">
          Katalog Produk
        </div>

        <h1 className="animate-fade-up animate-delay-100 mt-7 max-w-4xl text-5xl font-black leading-[0.95] text-zinc-950 sm:text-6xl lg:text-7xl">
          UNA Project
        </h1>
        <p className="animate-fade-up animate-delay-200 mt-6 max-w-3xl text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8">
          Menghadirkan solusi jam waktu sholat digital, running text LED, dan
          produk custom modern untuk masjid, mushola, sekolah, kantor, serta
          instansi Anda.
        </p>

        <div className="animate-fade-up animate-delay-300 mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/products"
            className="motion-button inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3.5 text-sm font-black tracking-[0.08em] text-white shadow-xl shadow-primary/20 hover:bg-tertiary sm:text-base"
          >
            Eksplorasi Katalog
          </Link>
          <Link
            href="/contact"
            className="motion-button inline-flex items-center justify-center rounded-xl border-2 border-primary px-5 py-3.5 text-sm font-black tracking-[0.08em] text-primary hover:bg-primary hover:text-white sm:text-base"
          >
            Konsultasi Pemasangan
          </Link>
        </div>

        <div className="mt-12 grid w-full max-w-4xl gap-4 text-left sm:mt-16 sm:grid-cols-3">
          {[
            ["Jam Waktu Sholat", "Display jadwal sholat digital untuk masjid."],
            ["Running Text LED", "Informasi berjalan untuk pengumuman harian."],
            ["Produk Custom", "Ukuran dan kebutuhan bisa dikonsultasikan."],
          ].map(([title, description], index) => (
            <div
              key={title}
              data-scroll-reveal="scale"
              data-scroll-delay={(index + 1) * 90}
              className={`scroll-reveal motion-card rounded-2xl border border-white/70 bg-white/75 p-5 shadow-xl shadow-primary/5 backdrop-blur sm:p-6 ${
                index === 0
                  ? "animate-delay-300"
                  : index === 1
                    ? "animate-delay-400"
                    : "animate-delay-500"
                  }`}
            >
              <p className="text-sm font-black text-zinc-950 sm:text-base">
                {title}
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-600 sm:text-base sm:leading-7">
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
