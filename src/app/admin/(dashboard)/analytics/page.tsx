import type { Metadata } from "next";
import { normalizeApiUrl } from "@/src/lib/adminAuth.mjs";
import { getVerifiedAdminToken } from "@/src/lib/adminSession";
import type { AnalyticsSummary } from "@/src/types/analytics";

export const metadata: Metadata = {
  title: "Laporan Analytics",
};

async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const [token, apiUrl] = await Promise.all([
    getVerifiedAdminToken(),
    normalizeApiUrl(process.env.API_URL),
  ]);
  if (!token || !apiUrl) {
    return { days: 30, website_views: 0, product_views: 0, whatsapp_clicks: 0, products: [] };
  }

  try {
    const response = await fetch(`${apiUrl}/admin/analytics/summary?days=30`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const payload = await response.json().catch(() => ({}));
    return payload.success && payload.data
      ? payload.data
      : { days: 30, website_views: 0, product_views: 0, whatsapp_clicks: 0, products: [] };
  } catch {
    return { days: 30, website_views: 0, product_views: 0, whatsapp_clicks: 0, products: [] };
  }
}

export default async function AdminAnalyticsPage() {
  const summary = await getAnalyticsSummary();
  const conversion =
    summary.product_views > 0
      ? Math.round((summary.whatsapp_clicks / summary.product_views) * 1000) / 10
      : 0;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <p className="text-sm font-bold text-una-teal">Laporan 30 Hari</p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.025em] text-una-ink sm:text-4xl">
          Analytical Report
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-una-muted sm:text-base">
          Ringkasan view website, view detail produk, dan klik CTA WhatsApp.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Website views", summary.website_views],
          ["Product views", summary.product_views],
          ["WhatsApp clicks", summary.whatsapp_clicks],
          ["Click/view", `${conversion}%`],
        ].map(([label, value]) => (
          <article key={label} className="rounded-xl border border-black/8 bg-white p-5">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-una-muted">
              {label}
            </p>
            <p className="mt-3 font-heading text-3xl font-black text-una-deep">{value}</p>
          </article>
        ))}
      </div>

      <section className="overflow-hidden rounded-xl border border-black/8 bg-white">
        <div className="border-b border-black/8 px-5 py-4">
          <h2 className="text-lg font-black text-una-ink">Produk paling dilihat</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-[#f5f6f0] text-xs uppercase tracking-[0.08em] text-una-muted">
              <tr>
                <th className="px-5 py-3 font-black">Produk</th>
                <th className="px-5 py-3 font-black">View</th>
                <th className="px-5 py-3 font-black">Klik WhatsApp</th>
                <th className="px-5 py-3 font-black">Rasio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/8">
              {summary.products.length === 0 ? (
                <tr>
                  <td className="px-5 py-8 text-center text-una-muted" colSpan={4}>
                    Belum ada event produk yang tercatat.
                  </td>
                </tr>
              ) : (
                summary.products.map((item) => {
                  const ratio =
                    item.product_views > 0
                      ? Math.round((item.whatsapp_clicks / item.product_views) * 1000) / 10
                      : 0;
                  return (
                    <tr key={item.product_slug}>
                      <td className="px-5 py-4 font-mono text-xs font-bold text-una-ink">
                        /products/{item.product_slug}
                      </td>
                      <td className="px-5 py-4 font-bold">{item.product_views}</td>
                      <td className="px-5 py-4 font-bold">{item.whatsapp_clicks}</td>
                      <td className="px-5 py-4 font-bold text-una-teal">{ratio}%</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
