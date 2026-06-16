import Link from "next/link";

export function Footer() {
  return (
    <footer className="animate-fade-in border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <Link
              href="/"
              className="group flex w-fit items-center gap-3 rounded-2xl transition-transform hover:-translate-y-0.5"
            >
              <span
                aria-hidden="true"
                className="grid size-11 grid-cols-2 gap-1 rounded-xl bg-primary p-1.5 shadow-lg shadow-primary/20 transition-transform group-hover:rotate-3"
              >
                <span className="rounded bg-white" />
                <span className="rounded bg-white/70" />
                <span className="rounded bg-white/70" />
                <span className="rounded bg-white" />
              </span>
              <span className="text-2xl font-black tracking-tight text-zinc-950">
                UNA Project
              </span>
            </Link>

            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8">
              Website katalog untuk jam waktu sholat digital, running text LED,
              dan produk display custom yang mudah dikonsultasikan.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {[
                "Jam waktu sholat",
                "Running text LED",
                "Jam digital",
                "Display custom",
              ].map((service) => (
                <span
                  key={service}
                  className="rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-sm font-bold text-primary"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          <div className="motion-card rounded-2xl border border-primary/15 bg-background p-5 shadow-xl shadow-primary/5 sm:p-6">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-primary">
              Konsultasi
            </p>
            <h2 className="mt-3 text-2xl font-black text-zinc-950 sm:text-3xl">
              Butuh konsultasi?
            </h2>
            <p className="mt-3 text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8">
              Ceritakan ukuran, lokasi pemasangan, dan jenis display yang
              dibutuhkan agar estimasi lebih jelas.
            </p>
            <Link
              href="/contact"
              className="motion-button mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-black tracking-[0.08em] text-white shadow-lg shadow-primary/20 hover:bg-tertiary sm:min-h-12 sm:px-6 sm:text-base"
            >
              Konsultasi
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-zinc-200 pt-6 text-sm font-semibold text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2024 UNA Project.</p>
          <p>Katalog modern untuk kebutuhan display digital.</p>
        </div>
      </div>
    </footer>
  );
}
