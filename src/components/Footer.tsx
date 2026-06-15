import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 text-sm text-zinc-700 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <Link href="/" className="flex items-center gap-3 font-semibold text-zinc-950">
          <span
            aria-hidden="true"
            className="grid size-6 grid-cols-2 gap-1 rounded-md bg-primary p-1"
          >
            <span className="rounded-sm bg-white" />
            <span className="rounded-sm bg-white/70" />
            <span className="rounded-sm bg-white/70" />
            <span className="rounded-sm bg-white" />
          </span>
          <span>UNA Project</span>
        </Link>

        <div className="flex flex-wrap gap-x-7 gap-y-3 text-xs font-semibold tracking-[0.18em] text-zinc-700">
          <Link href="/products" className="underline-offset-4 hover:underline">
            Produk
          </Link>
          <Link href="/order" className="underline-offset-4 hover:underline">
            Transaksi
          </Link>
          <Link href="/tutorial" className="underline-offset-4 hover:underline">
            Tutorial
          </Link>
          <Link href="/contact" className="underline-offset-4 hover:underline">
            Kontak
          </Link>
        </div>

        <p className="text-tertiary">
          © 2024 UNA Project. Designed for clearer connection.
        </p>
      </div>
    </footer>
  );
}
