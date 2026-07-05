import type { AdminSection } from "@/src/types/admin";

type AdminCollectionPageProps = {
  section: AdminSection;
};

export function AdminCollectionPage({ section }: AdminCollectionPageProps) {
  const showWhatsAppPreview = section.slug === "whatsapp-templates";

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-5 border-b border-black/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-bold text-una-teal">Konten website</p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.025em] text-una-ink sm:text-4xl">
            {section.title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-una-muted sm:text-base">
            {section.description}
          </p>
        </div>
        <button
          type="button"
          disabled
          title="Aktif setelah REST API dan sesi admin terhubung"
          className="min-h-11 shrink-0 cursor-not-allowed rounded-lg bg-[#e2b64d] px-5 text-sm font-black text-una-gold-ink opacity-55"
        >
          {section.actionLabel}
        </button>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-300/70 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
        <span aria-hidden="true" className="mt-2 size-2 shrink-0 rounded-full bg-amber-500" />
        <p>
          Data di bawah berasal dari file lokal. Tombol tambah, edit, dan hapus
          akan aktif setelah <code className="font-bold">NEXT_PUBLIC_API_URL</code>,
          autentikasi cookie, dan endpoint Golang tersedia.
        </p>
      </div>

      <section className="mt-6 overflow-hidden rounded-xl border border-black/10 bg-white">
        <div className="flex items-center justify-between gap-4 border-b border-black/8 px-4 py-4 sm:px-5">
          <div>
            <h2 className="text-base font-black text-una-ink">
              Daftar {section.label}
            </h2>
            <p className="mt-1 text-xs text-una-muted">
              {section.rows.length} data tersedia
            </p>
          </div>
          <span className="rounded-full bg-una-soft px-3 py-1.5 text-xs font-bold text-una-teal">
            Data lokal
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <caption className="sr-only">
              Daftar data {section.label} UNA Project
            </caption>
            <thead className="bg-[#f5f6f0] text-xs uppercase tracking-[0.08em] text-una-muted">
              <tr>
                {section.columns.map((column) => (
                  <th key={column} scope="col" className="px-5 py-3 font-black">
                    {column}
                  </th>
                ))}
                <th scope="col" className="px-5 py-3 font-black">Status</th>
                <th scope="col" className="px-5 py-3 text-right font-black">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/8">
              {section.rows.map((row) => (
                <tr key={row.id} className="align-top hover:bg-[#fafaf5]">
                  {row.cells.map((cell, index) => (
                    <td
                      key={`${row.id}-${section.columns[index]}`}
                      className={`max-w-md px-5 py-4 leading-6 ${
                        index === 0 ? "font-bold text-una-ink" : "text-una-muted"
                      }`}
                    >
                      {cell}
                      {index === 0 && row.featured ? (
                        <span className="ml-2 inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[0.65rem] font-black uppercase tracking-wide text-amber-800">
                          Unggulan
                        </span>
                      ) : null}
                    </td>
                  ))}
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
                      <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-500" />
                      {row.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        disabled
                        className="min-h-9 cursor-not-allowed rounded-md border border-una-deep/20 px-3 text-xs font-bold text-una-deep opacity-45"
                      >
                        Edit
                      </button>
                      {section.canDelete !== false ? (
                        <button
                          type="button"
                          disabled
                          className="min-h-9 cursor-not-allowed rounded-md bg-red-600 px-3 text-xs font-bold text-white opacity-35"
                        >
                          Hapus
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {showWhatsAppPreview ? (
        <section className="mt-6 grid gap-5 rounded-xl border border-black/10 bg-white p-5 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.12em] text-una-teal">
              Preview placeholder
            </p>
            <h2 className="mt-2 text-xl font-black text-una-ink">
              Pesan yang diterima customer
            </h2>
            <p className="mt-2 text-sm leading-6 text-una-muted">
              Placeholder <code className="font-bold">{"{product_name}"}</code>{" "}
              diganti oleh nama produk sebelum tautan WhatsApp dibuka.
            </p>
          </div>
          <div className="rounded-xl bg-[#eef7f2] p-4 text-sm leading-7 text-una-ink">
            Assalamualaikum UNA Project, saya tertarik dengan{" "}
            <strong>JWS RGB 2 Panel Frame Figura</strong>. Mohon info harga dan
            pemasangannya.
          </div>
        </section>
      ) : null}
    </div>
  );
}
