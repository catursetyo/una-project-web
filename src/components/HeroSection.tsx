import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-zinc-200 bg-white">
      <div className="hero-showcase">
        <div className="hero-showcase-copy">
          <div className="hero-showcase-kicker">Katalog Produk</div>
          <h1 className="hero-showcase-title">UNA Project</h1>
          <p className="hero-showcase-description">
            Solusi jam waktu sholat digital, running text LED, dan produk
            custom modern untuk masjid, mushola, sekolah, kantor, serta
            instansi Anda.
          </p>
          <div className="hero-showcase-actions">
            <Link
              href="/products"
              className="motion-button inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3.5 text-sm font-black tracking-[0.08em] text-white shadow-lg shadow-primary/20 hover:bg-tertiary sm:text-base"
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
          <div className="hero-showcase-proof">
            <div className="hero-showcase-proof-item">
              <p className="hero-showcase-proof-title">Jam Waktu Sholat</p>
              <p className="hero-showcase-proof-text">
                Display jadwal sholat digital untuk masjid.
              </p>
            </div>
            <div className="hero-showcase-proof-item">
              <p className="hero-showcase-proof-title">Running Text LED</p>
              <p className="hero-showcase-proof-text">
                Informasi berjalan untuk pengumuman harian.
              </p>
            </div>
            <div className="hero-showcase-proof-item">
              <p className="hero-showcase-proof-title">Produk Custom</p>
              <p className="hero-showcase-proof-text">
                Ukuran dan kebutuhan bisa dikonsultasikan.
              </p>
            </div>
          </div>
        </div>
        <div className="hero-showcase-panel" aria-hidden="true">
          <div className="hero-showcase-screen">
            <div>
              <div className="hero-showcase-chip">Display Aktif</div>
              <div className="hero-showcase-clock">04:15</div>
              <div className="hero-showcase-running">
                Jadwal sholat digital siap custom
              </div>
            </div>
            <div className="hero-showcase-prayer">
              <span>Subuh 04:15</span>
              <span>Dzuhur 11:42</span>
              <span>Ashar 15:03</span>
              <span>Isya 19:02</span>
            </div>
          </div>
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
