import Link from "next/link";
import { adminModules } from "@/src/data/admin";

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

      <div className="mt-8 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
        <span className="size-2 shrink-0 rounded-full bg-emerald-500" />
        <span className="font-bold">
          {apiUrl ? "API aktif dan sesi terverifikasi" : "API belum dikonfigurasi"}
        </span>
      </div>

      <section className="mt-6 overflow-hidden rounded-xl border border-black/8 bg-white">
        {adminModules.map((module, index) => (
          <Link
            key={module.href}
            href={module.href}
            className="group grid min-h-28 gap-4 border-b border-black/8 p-5 transition-colors last:border-b-0 hover:bg-[#f1f3ec] focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-una-teal sm:grid-cols-[3rem_12rem_1fr_auto] sm:items-center"
          >
            <span className="font-heading text-sm font-black text-una-gold-ink">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-lg font-black text-una-ink">
              {module.label}
            </span>
            <span className="max-w-2xl text-sm leading-6 text-una-muted">
              {module.description}
            </span>
            <span className="text-sm font-black text-una-teal group-hover:text-una-deep">
              Buka →
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}
