import Link from "next/link";

const navigationItems = [
  { label: "Halaman", href: "/" },
  { label: "Produk", href: "/products" },
  { label: "Transaksi", href: "/order" },
  { label: "Tutorial", href: "/tutorial" },
  { label: "Tentang", href: "/about" },
];

export function Navbar() {
  return (
    <header className="animate-slide-down sticky top-0 z-40 border-b border-zinc-200/80 bg-white/95 backdrop-blur-xl">
      <nav
        aria-label="Navigasi utama"
        className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8"
      >
        <Link
          href="/"
          className="group flex w-fit items-center gap-3 rounded-2xl pr-3 transition-transform hover:-translate-y-0.5"
        >
          <span
            aria-hidden="true"
            className="grid size-10 grid-cols-2 gap-1 rounded-xl bg-primary p-1.5 shadow-lg shadow-primary/25 transition-transform group-hover:rotate-3"
          >
            <span className="rounded bg-white" />
            <span className="rounded bg-white/70" />
            <span className="rounded bg-white/70" />
            <span className="rounded bg-white" />
          </span>
          <span className="text-xl font-black tracking-tight text-zinc-950">
            UNA Project
          </span>
        </Link>

        <div className="flex flex-col gap-3 lg:ml-auto lg:flex-row lg:items-center lg:justify-end">
          <div className="flex flex-wrap items-center gap-1 rounded-2xl border border-zinc-200 bg-background/80 p-1.5 text-sm font-black tracking-[0.08em] text-zinc-700 shadow-sm shadow-primary/5 lg:justify-end">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link-motion"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <Link
            href="/contact"
            className="motion-button inline-flex min-h-12 items-center justify-center rounded-2xl bg-primary px-6 text-sm font-black tracking-[0.12em] text-white shadow-xl shadow-primary/20 hover:bg-tertiary"
          >
            Konsultasi
          </Link>
        </div>
      </nav>
    </header>
  );
}
