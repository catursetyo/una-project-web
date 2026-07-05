import Link from "next/link";
import { LogoMark } from "@/src/components/ui/LogoMark";

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-screen bg-[#fafaf5] lg:grid-cols-[0.85fr_1.15fr]">
      <section className="flex flex-col justify-between bg-una-deep p-6 text-white sm:p-10 lg:p-14">
        <Link
          href="/"
          className="flex w-fit items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-una-gold"
        >
          <LogoMark size="md" />
          <span className="font-heading text-xl font-black">UNA Project</span>
        </Link>

        <div className="my-16 max-w-lg lg:my-0">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-una-gold-light">
            Ruang kerja internal
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight tracking-[-0.03em] sm:text-5xl">
            Kelola konten website dengan lebih terarah.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/65 sm:text-base">
            Produk, testimoni, tutorial, alur pemesanan, dan template WhatsApp
            berada dalam satu dashboard.
          </p>
        </div>

        <p className="text-xs text-white/45">UNA Project Admin • Pratinjau UI</p>
      </section>

      <section className="flex items-center justify-center px-4 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-md rounded-xl border border-black/10 bg-white p-6 sm:p-8">
          <p className="text-sm font-bold text-una-teal">Admin Dashboard</p>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.025em] text-una-ink">
            Masuk ke akun
          </h2>
          <p className="mt-3 text-sm leading-6 text-una-muted">
            Form sudah mengikuti struktur login, tetapi autentikasi belum aktif
            karena backend Golang belum tersedia di repositori ini.
          </p>

          <form className="mt-7 space-y-5">
            <div>
              <label htmlFor="email" className="text-sm font-bold text-una-ink">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="admin@unaproject.com"
                className="mt-2 min-h-12 w-full rounded-lg border border-black/15 bg-white px-4 text-sm outline-none transition focus:border-una-teal focus:ring-3 focus:ring-una-teal/15"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-bold text-una-ink">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Masukkan password"
                className="mt-2 min-h-12 w-full rounded-lg border border-black/15 bg-white px-4 text-sm outline-none transition focus:border-una-teal focus:ring-3 focus:ring-una-teal/15"
              />
            </div>

            <button
              type="button"
              disabled
              title="Aktif setelah endpoint POST /auth/login terhubung"
              className="min-h-12 w-full cursor-not-allowed rounded-lg bg-[#e2b64d] px-5 text-sm font-black text-una-gold-ink opacity-55"
            >
              Masuk
            </button>
          </form>

          <div className="mt-6 border-t border-black/8 pt-5 text-center">
            <Link
              href="/admin"
              className="inline-flex min-h-10 items-center text-sm font-bold text-una-teal hover:text-una-deep"
            >
              Buka pratinjau dashboard →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
