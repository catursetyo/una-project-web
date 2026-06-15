import { FeatureCard } from "@/src/components/FeatureCard";

const features = [
  {
    label: "Konsultasi",
    title: "Kebutuhan dibahas lebih dulu",
    description:
      "Ukuran, lokasi pemasangan, jenis panel, dan kebutuhan informasi dibicarakan sebelum produksi agar produk lebih tepat guna.",
  },
  {
    label: "Custom",
    title: "Bisa menyesuaikan tempat",
    description:
      "Produk dapat disesuaikan untuk masjid, mushola, sekolah, kantor, toko, atau instansi dengan kebutuhan tampilan berbeda.",
  },
  {
    label: "Praktis",
    title: "Fokus pada penggunaan harian",
    description:
      "Tampilan dibuat jelas, mudah dibaca, dan cocok untuk informasi penting seperti jadwal sholat, jam digital, atau pesan berjalan.",
  },
  {
    label: "Panduan",
    title: "Dibantu sampai paham",
    description:
      "Customer tetap mendapat arahan dasar untuk penggunaan dan setting produk setelah proses pembelian atau pemasangan.",
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Keunggulan
          </p>
          <h2 className="mt-3 text-3xl font-bold text-zinc-950">
            Dibuat untuk kebutuhan nyata di lapangan
          </h2>
          <p className="mt-4 text-base leading-7 text-zinc-600">
            Website baru ini menampilkan UNA Project dengan alur yang lebih
            jelas: calon customer bisa memahami layanan, melihat produk, lalu
            lanjut konsultasi lewat WhatsApp.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              label={feature.label}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
