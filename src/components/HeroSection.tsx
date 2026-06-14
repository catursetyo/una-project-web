import Link from "next/link";

export function HeroSection() {
  return (
    <section className="bg-zinc-50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Solusi jam digital dan LED display
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-zinc-950 sm:text-5xl">
            UNA Project
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-700">
            Membantu masjid, mushola, sekolah, kantor, dan instansi membuat jam
            waktu sholat, running text LED, serta produk digital custom yang
            rapi dan mudah digunakan.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-md bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
            >
              Lihat Produk
            </Link>
            <Link
              href="/order"
              className="inline-flex items-center justify-center rounded-md border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:border-emerald-700 hover:text-emerald-700"
            >
              Cara Pesan
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-zinc-950 p-5 shadow-sm">
          <div className="rounded-md border border-emerald-500/30 bg-black p-4">
            <div className="mb-4 flex items-center justify-between text-xs text-zinc-400">
              <span>Jadwal Waktu Sholat</span>
              <span>UNA Project</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya", "Jumat"].map(
                (label) => (
                  <div
                    key={label}
                    className="rounded border border-zinc-800 bg-zinc-900 px-3 py-4"
                  >
                    <p className="text-xs text-zinc-400">{label}</p>
                    <p className="mt-2 font-mono text-xl font-semibold text-emerald-400">
                      04:32
                    </p>
                  </div>
                ),
              )}
            </div>
            <div className="mt-4 overflow-hidden rounded border border-amber-500/30 bg-amber-950/40 px-3 py-2">
              <p className="truncate font-mono text-sm font-semibold text-amber-300">
                Selamat datang di Masjid - Running text siap custom
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
