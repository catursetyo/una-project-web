import Link from "next/link";

const navigationItems = [
  { label: "Beranda", href: "/" },
  { label: "Produk", href: "/products" },
  { label: "Tutorial", href: "/tutorial" },
  { label: "Cara Pesan", href: "/order" },
  { label: "Kontak", href: "/contact" },
];

export function Navbar() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <nav
        aria-label="Navigasi utama"
        className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"
      >
        <Link href="/" className="flex flex-col">
          <span className="text-lg font-bold text-zinc-950">UNA Project</span>
          <span className="text-sm text-zinc-600">
            Jam digital dan running text LED
          </span>
        </Link>

        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-zinc-700">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-emerald-700"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
