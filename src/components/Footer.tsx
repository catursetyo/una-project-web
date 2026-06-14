import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-950 text-zinc-300">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:px-8">
        <div>
          <p className="text-base font-semibold text-white">UNA Project</p>
          <p className="mt-2 max-w-md text-sm leading-6">
            Penyedia jam digital, jam waktu sholat, running text LED, dan
            produk custom untuk masjid, sekolah, kantor, serta instansi.
          </p>
        </div>

        <div className="sm:text-right">
          <p className="text-sm font-semibold text-white">Navigasi</p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm sm:justify-end">
            <Link href="/products" className="hover:text-white">
              Produk
            </Link>
            <Link href="/tutorial" className="hover:text-white">
              Tutorial
            </Link>
            <Link href="/order" className="hover:text-white">
              Cara Pesan
            </Link>
            <Link href="/contact" className="hover:text-white">
              Kontak
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
