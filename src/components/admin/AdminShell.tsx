import Link from "next/link";
import { AdminNavigation } from "@/src/components/admin/AdminNavigation";
import { LogoMark } from "@/src/components/ui/LogoMark";

type AdminShellProps = {
  children: React.ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-[#fafaf5] text-una-ink lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="bg-una-deep px-4 py-4 text-white sm:px-6 lg:sticky lg:top-0 lg:h-screen lg:px-5 lg:py-6">
        <div className="flex items-center justify-between gap-4 lg:block">
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-una-gold"
          >
            <LogoMark size="md" />
            <span className="leading-tight">
              <span className="block font-heading text-lg font-bold">
                UNA Project
              </span>
              <span className="block text-[0.65rem] font-bold uppercase tracking-[0.16em] text-una-gold-light">
                Admin Dashboard
              </span>
            </span>
          </Link>

          <Link
            href="/"
            className="rounded-lg border border-white/15 px-3 py-2 text-xs font-bold text-white/75 transition-colors hover:border-white/30 hover:text-white lg:hidden"
          >
            Lihat situs
          </Link>
        </div>

        <div className="mt-5 border-t border-white/10 pt-4 lg:mt-8 lg:pt-6">
          <AdminNavigation />
        </div>

        <div className="mt-8 hidden border-t border-white/10 pt-5 lg:block">
          <p className="text-xs leading-5 text-white/48">
            Antarmuka pratinjau menggunakan data lokal hingga REST API terhubung.
          </p>
          <Link
            href="/admin/login"
            className="mt-4 inline-flex min-h-10 items-center text-sm font-bold text-una-gold-light hover:text-white"
          >
            Kembali ke login
          </Link>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between gap-4 border-b border-black/8 bg-[#fafaf5]/95 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-una-teal">
              Ruang kerja internal
            </p>
            <p className="text-sm font-bold text-una-muted">UNA Project</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800 sm:inline-flex">
              Mode pratinjau
            </span>
            <span
              aria-label="Profil admin placeholder"
              className="grid size-10 place-items-center rounded-full bg-una-deep font-heading text-sm font-black text-white"
            >
              UA
            </span>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
