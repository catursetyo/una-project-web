import Link from "next/link";
import { adminSections, dashboardStats } from "@/src/data/admin";

export default function AdminDashboardPage() {
  const apiUrl = process.env.API_URL;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="max-w-3xl">
        <p className="text-sm font-bold text-una-teal">Dashboard</p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.025em] text-una-ink sm:text-4xl">
          Ringkasan konten UNA Project
        </h1>
        <p className="mt-3 text-sm leading-6 text-una-muted sm:text-base">
          Pantau isi website dan buka modul yang ingin diperbarui dari satu
          ruang kerja.
        </p>
      </div>

      <dl className="mt-8 grid overflow-hidden rounded-xl border border-black/10 bg-white sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <div
            key={stat.label}
            className="border-b border-black/8 p-5 last:border-b-0 sm:nth-[2n]:border-l sm:nth-[3]:border-b-0 xl:border-b-0 xl:border-l xl:first:border-l-0"
          >
            <dt className="text-sm font-bold text-una-muted">{stat.label}</dt>
            <dd className="mt-2 font-heading text-3xl font-black text-una-deep">
              {stat.value}
            </dd>
            <Link
              href={stat.href}
              className="mt-3 inline-flex min-h-9 items-center text-xs font-black text-una-teal hover:text-una-deep"
            >
              Kelola {stat.label.toLowerCase()} →
            </Link>
          </div>
        ))}
      </dl>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_0.8fr]">
        <section className="overflow-hidden rounded-xl border border-black/10 bg-white">
          <div className="border-b border-black/8 px-5 py-4">
            <h2 className="text-lg font-black text-una-ink">Modul pengelolaan</h2>
            <p className="mt-1 text-sm text-una-muted">
              Struktur mengikuti endpoint dan tabel pada dokumentasi proyek.
            </p>
          </div>
          <div className="divide-y divide-black/8">
            {adminSections.map((section) => (
              <Link
                key={section.slug}
                href={`/admin/${section.slug}`}
                className="flex min-h-20 items-center justify-between gap-5 px-5 py-4 transition-colors hover:bg-[#f5f6f0] focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-una-teal"
              >
                <span>
                  <span className="block font-bold text-una-ink">{section.label}</span>
                  <span className="mt-1 block text-sm leading-5 text-una-muted">
                    {section.rows.length} data lokal
                  </span>
                </span>
                <span aria-hidden="true" className="text-lg text-una-teal">→</span>
              </Link>
            ))}
          </div>
        </section>

        <aside className="h-fit rounded-xl border border-black/10 bg-una-deep p-5 text-white">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-una-gold-light">
            Status integrasi
          </p>
          <h2 className="mt-3 text-xl font-black">
            {apiUrl ? "API dan sesi terhubung" : "API belum terhubung"}
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/65">
            {apiUrl
              ? "Identitas admin sudah diverifikasi melalui endpoint /auth/me. Konten masih memakai data lokal sampai endpoint CRUD dihubungkan."
              : "Tambahkan API_URL pada environment server. Sampai saat itu dashboard menolak akses dan tidak memalsukan sesi."}
          </p>
          <div className="mt-5 border-t border-white/10 pt-5">
            <p className="text-sm font-bold text-white">Tahap integrasi berikutnya</p>
            <ol className="mt-3 space-y-3 text-sm leading-5 text-white/65">
              <li>1. Hubungkan endpoint list admin.</li>
              <li>2. Aktifkan mutation dengan verifikasi sesi.</li>
              <li>3. Ganti fallback lokal setelah API stabil.</li>
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}
