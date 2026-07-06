import Link from "next/link";
import { redirect } from "next/navigation";
import { login } from "@/src/app/admin/actions";
import { LogoMark } from "@/src/components/ui/LogoMark";
import { verifyAdminSession } from "@/src/lib/adminSession";

const loginErrors: Record<string, string> = {
  configuration: "API backend belum dikonfigurasi.",
  credentials: "Email atau password tidak valid.",
  invalid: "Periksa kembali format email dan password.",
  unavailable: "Layanan login sedang tidak tersedia. Coba beberapa saat lagi.",
};

type AdminLoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const [admin, { error }] = await Promise.all([
    verifyAdminSession(),
    searchParams,
  ]);
  const apiConfigured = Boolean(process.env.API_URL);
  const publicSiteUrl = process.env.PUBLIC_SITE_URL ?? "https://unaproject.my.id";

  if (admin) {
    redirect("/admin");
  }

  const errorMessage = error ? loginErrors[error] : undefined;

  return (
    <main className="grid min-h-screen bg-[#fafaf5] lg:grid-cols-[0.85fr_1.15fr]">
      <section className="flex flex-col justify-between bg-una-deep p-6 text-white sm:p-10 lg:p-14">
        <Link
          href={publicSiteUrl}
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
            Masukkan akun admin UNA Project. Kredensial diproses server-side
            dan tidak disimpan di localStorage.
          </p>

          {!apiConfigured ? (
            <p className="mt-5 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
              Login belum dapat digunakan sampai environment server
              <code className="ml-1 font-bold">API_URL</code> tersedia.
            </p>
          ) : null}

          {errorMessage ? (
            <p
              id="login-error"
              role="alert"
              className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800"
            >
              {errorMessage}
            </p>
          ) : null}

          <form action={login} className="mt-7 space-y-5">
            <div>
              <label htmlFor="email" className="text-sm font-bold text-una-ink">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="admin@unaproject.my.id"
                required
                maxLength={254}
                aria-describedby={errorMessage ? "login-error" : undefined}
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
                required
                maxLength={128}
                aria-describedby={errorMessage ? "login-error" : undefined}
                className="mt-2 min-h-12 w-full rounded-lg border border-black/15 bg-white px-4 text-sm outline-none transition focus:border-una-teal focus:ring-3 focus:ring-una-teal/15"
              />
            </div>

            <button
              type="submit"
              disabled={!apiConfigured}
              className="min-h-12 w-full rounded-lg bg-[#e2b64d] px-5 text-sm font-black text-una-gold-ink transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-una-teal disabled:cursor-not-allowed disabled:opacity-50"
            >
              Masuk
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
