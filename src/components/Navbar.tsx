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
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur">
      <nav
        aria-label="Navigasi utama"
        className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8"
      >
        <Link href="/" className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="grid size-7 grid-cols-2 gap-1 rounded-md bg-primary p-1 shadow-sm shadow-primary/30"
          >
            <span className="rounded-sm bg-white" />
            <span className="rounded-sm bg-white/70" />
            <span className="rounded-sm bg-white/70" />
            <span className="rounded-sm bg-white" />
          </span>
          <span className="text-base font-bold text-zinc-950">
            UNA Project
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-xs font-semibold tracking-[0.24em] text-zinc-700 md:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden text-xs font-semibold tracking-[0.2em] text-zinc-700 transition-colors hover:text-primary sm:inline"
          >
            Kontak
          </Link>
          <Link
            href="/order"
            className="rounded-full bg-primary px-5 py-3 text-xs font-bold tracking-[0.16em] text-white shadow-lg shadow-primary/25 transition-colors hover:bg-tertiary"
          >
            Konsultasi
          </Link>
        </div>
      </nav>
    </header>
  );
}
