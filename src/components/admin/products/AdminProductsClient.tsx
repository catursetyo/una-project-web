"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/src/lib/formatPrice";
import type { ApiProduct, ApiProductVariant } from "@/src/types/product";
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
  type ProductInputData,
} from "@/src/app/admin/(dashboard)/products/actions";
import { uploadMediaAction } from "@/src/app/admin/(dashboard)/uploads/actions";

type AdminProductsClientProps = {
  initialProducts: ApiProduct[];
};

const CUSTOM_CATEGORY_VALUE = "__custom_category__";
const DEFAULT_PRODUCT_CATEGORIES = ["Jam Waktu Sholat", "Lisensi Aplikasi", "Jam Digital", "Seven Segment"];

export function AdminProductsClient({ initialProducts }: AdminProductsClientProps) {
  const router = useRouter();
  const products = initialProducts;
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ApiProduct | null>(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<ApiProduct | null>(null);
  
  // Feedback state
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  // Form state
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formSlugManuallyEdited, setFormSlugManuallyEdited] = useState(false);
  const [formCategory, setFormCategory] = useState("Jam Waktu Sholat");
  const [formPriceStart, setFormPriceStart] = useState<number>(0);
  const [formOrderIndex, setFormOrderIndex] = useState<number>(1);
  const [formShortDesc, setFormShortDesc] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formDimensions, setFormDimensions] = useState("");
  const [formFeaturesText, setFormFeaturesText] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formVideoUrl, setFormVideoUrl] = useState("");
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsActive, setFormIsActive] = useState(true);
  const [formVariants, setFormVariants] = useState<ApiProductVariant[]>([]);
  const [isUploadingProductImage, setIsUploadingProductImage] = useState(false);

  // Unique categories for filter
  const categories = useMemo(() => {
    const cats = new Set([...DEFAULT_PRODUCT_CATEGORIES, ...products.map((p) => p.category)]);
    return Array.from(cats);
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchQuery =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = filterCategory === "ALL" || p.category === filterCategory;
      return matchQuery && matchCat;
    });
  }, [products, searchQuery, filterCategory]);

  function openCreateModal() {
    setEditingProduct(null);
    setFormName("");
    setFormSlug("");
    setFormSlugManuallyEdited(false);
    setFormCategory("Jam Waktu Sholat");
    setFormPriceStart(1500000);
    setFormOrderIndex(products.length + 1);
    setFormShortDesc("");
    setFormDesc("");
    setFormDimensions("68 x 20 x 5 cm");
    setFormFeaturesText("Jadwal sholat otomatis akurat\nKontrol via aplikasi Android / Wi-Fi\nDisplay LED super terang");
    setFormImageUrl("");
    setFormVideoUrl("");
    setFormIsFeatured(false);
    setFormIsActive(true);
    setFormVariants([
      { name: "Standard", price: 1500000, description: "Unit lengkap siap pasang", order_index: 1 },
    ]);
    setFieldErrors({});
    setFeedback(null);
    setIsFormModalOpen(true);
  }

  function openEditModal(prod: ApiProduct) {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormSlug(prod.slug);
    setFormSlugManuallyEdited(true);
    setFormCategory(prod.category);
    setFormPriceStart(prod.price_start_from);
    setFormOrderIndex(prod.order_index);
    setFormShortDesc(prod.short_description);
    setFormDesc(prod.description);
    setFormDimensions(prod.dimensions || "");
    setFormFeaturesText((prod.features || []).join("\n"));
    setFormImageUrl(prod.image_url || "");
    setFormVideoUrl(prod.video_url || "");
    setFormIsFeatured(prod.is_featured);
    setFormIsActive(prod.is_active);
    setFormVariants(
      prod.variants && prod.variants.length > 0
        ? prod.variants.map((v, idx) => ({ ...v, order_index: v.order_index || idx + 1 }))
        : [{ name: "Standard", price: prod.price_start_from, description: "", order_index: 1 }]
    );
    setFieldErrors({});
    setFeedback(null);
    setIsFormModalOpen(true);
  }

  function handleNameChange(val: string) {
    setFormName(val);
    if (!formSlugManuallyEdited && !editingProduct) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormSlug(generatedSlug);
    }
  }

  function addVariant() {
    setFormVariants((prev) => [
      ...prev,
      {
        name: `Varian ${prev.length + 1}`,
        price: formPriceStart,
        description: "",
        order_index: prev.length + 1,
      },
    ]);
  }

  function removeVariant(index: number) {
    setFormVariants((prev) => prev.filter((_, idx) => idx !== index));
  }

  function updateVariantField<K extends keyof ApiProductVariant>(
    index: number,
    field: K,
    value: ApiProductVariant[K]
  ) {
    setFormVariants((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  async function handleProductImageUpload(file?: File) {
    if (!file) return;
    setIsUploadingProductImage(true);
    const formData = new FormData();
    formData.append("kind", "products");
    formData.append("file", file);
    const res = await uploadMediaAction(formData);
    setIsUploadingProductImage(false);
    if (res.success && res.url) {
      setFormImageUrl(res.url);
      setFeedback({ type: "success", text: "Gambar produk berhasil diupload." });
      return;
    }
    setFeedback({ type: "error", text: res.error || "Upload gambar gagal." });
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);
    setFieldErrors({});

    const featuresList = formFeaturesText
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const payload: ProductInputData = {
      slug: formSlug.trim(),
      name: formName.trim(),
      category: formCategory.trim(),
      short_description: formShortDesc.trim(),
      description: formDesc.trim(),
      dimensions: formDimensions.trim() ? formDimensions.trim() : undefined,
      features: featuresList,
      price_start_from: Number(formPriceStart) || 0,
      image_url: formImageUrl.trim() || undefined,
      video_url: formVideoUrl.trim() || undefined,
      is_featured: formIsFeatured,
      is_active: formIsActive,
      order_index: Number(formOrderIndex) || 1,
      variants: formVariants.map((v, idx) => ({
        name: v.name.trim() || `Varian ${idx + 1}`,
        price: Number(v.price) || 0,
        description: v.description?.trim() ? v.description.trim() : undefined,
        order_index: idx + 1,
      })),
    };

    startTransition(async () => {
      let res;
      if (editingProduct) {
        res = await updateProductAction(editingProduct.id, payload);
      } else {
        res = await createProductAction(payload);
      }

      if (res.success) {
        setIsFormModalOpen(false);
        setFeedback({ type: "success", text: res.message || "Berhasil disimpan!" });
        router.refresh();
      } else {
        setFeedback({ type: "error", text: res.error || "Gagal menyimpan produk." });
        if (res.errors) {
          setFieldErrors(res.errors);
        }
      }
    });
  }

  function confirmDelete(prod: ApiProduct) {
    setDeletingProduct(prod);
    setIsDeleteModalOpen(true);
  }

  function handleDeleteSubmit() {
    if (!deletingProduct) return;
    startTransition(async () => {
      const res = await deleteProductAction(deletingProduct.id);
      if (res.success) {
        setIsDeleteModalOpen(false);
        setDeletingProduct(null);
        setFeedback({ type: "success", text: res.message || "Produk berhasil dihapus!" });
        router.refresh();
      } else {
        setFeedback({ type: "error", text: res.error || "Gagal menghapus produk." });
      }
    });
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Feedback Toast */}
      {feedback ? (
        <div
          className={`flex items-center justify-between rounded-xl border p-4 text-sm font-bold shadow-sm transition-all ${
            feedback.type === "success"
              ? "border-emerald-300 bg-emerald-50 text-emerald-900"
              : "border-red-300 bg-red-50 text-red-900"
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`size-2.5 rounded-full ${
                feedback.type === "success" ? "bg-emerald-600" : "bg-red-600"
              }`}
            />
            <span>{feedback.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs opacity-70 hover:opacity-100"
          >
            Tutup [x]
          </button>
        </div>
      ) : null}

      {/* Header Banner */}
      <div className="flex flex-col gap-5 border-b border-black/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-una-teal">Modul Real-Time API</p>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[0.65rem] font-black uppercase tracking-wider text-emerald-800">
              <span className="size-1.5 rounded-full bg-emerald-600" />
              Golang Connected
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.025em] text-una-ink sm:text-4xl">
            Manajemen Katalog Produk
          </h1>
          <p className="mt-3 text-sm leading-6 text-una-muted sm:text-base">
            Kelola data produk, harga mulai, varian, dan spesifikasi yang terhubung langsung ke database PostgreSQL melalui Golang REST API.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="gold-cta motion-button inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-6 text-sm font-black shadow-md hover:shadow-lg"
        >
          <span>+ Tambah Produk</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col gap-4 rounded-xl border border-black/10 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Cari produk berdasarkan nama atau slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-black/15 bg-una-soft/50 px-4 py-2 text-sm text-una-ink placeholder-una-muted focus:border-una-teal focus:bg-white focus:outline-none"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-xs font-bold text-una-muted hover:text-una-ink"
              >
                ✕
              </button>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-una-muted">Kategori:</span>
          <button
            type="button"
            onClick={() => setFilterCategory("ALL")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
              filterCategory === "ALL"
                ? "bg-una-deep text-white"
                : "bg-una-soft text-una-muted hover:bg-black/10 hover:text-una-ink"
            }`}
          >
            Semua ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors whitespace-nowrap ${
                filterCategory === cat
                  ? "bg-una-deep text-white"
                  : "bg-una-soft text-una-muted hover:bg-black/10 hover:text-una-ink"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid / Table */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/20 bg-white py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-una-soft text-2xl">
            📦
          </div>
          <h3 className="mt-4 text-base font-black text-una-ink">
            {searchQuery || filterCategory !== "ALL"
              ? "Produk tidak ditemukan"
              : "Belum ada produk di database"}
          </h3>
          <p className="mt-1 max-w-sm text-xs text-una-muted">
            {searchQuery || filterCategory !== "ALL"
              ? "Coba ubah kata kunci pencarian atau filter kategori di atas."
              : "Mulai tambahkan produk pertama untuk katalog UNA Project dengan menekan tombol Tambah Produk di atas."}
          </p>
          {searchQuery || filterCategory !== "ALL" ? (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setFilterCategory("ALL");
              }}
              className="mt-4 rounded-lg bg-una-soft px-4 py-2 text-xs font-bold text-una-teal hover:bg-black/10"
            >
              Reset Filter
            </button>
          ) : null}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-left text-sm">
              <thead className="bg-[#f5f6f0] text-xs uppercase tracking-[0.08em] text-una-muted">
                <tr>
                  <th scope="col" className="px-5 py-3.5 font-black">Produk & Slug</th>
                  <th scope="col" className="px-5 py-3.5 font-black">Kategori</th>
                  <th scope="col" className="px-5 py-3.5 font-black">Harga Mulai</th>
                  <th scope="col" className="px-5 py-3.5 font-black">Varian</th>
                  <th scope="col" className="px-5 py-3.5 font-black">Status</th>
                  <th scope="col" className="px-5 py-3.5 text-right font-black">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/8">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="align-middle transition-colors hover:bg-[#fafaf5]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-una-deep text-white shadow-inner font-led text-base">
                          {prod.name.slice(0, 3).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-una-ink">{prod.name}</span>
                            {prod.is_featured ? (
                              <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[0.65rem] font-black uppercase text-amber-800">
                                ⭐ Unggulan
                              </span>
                            ) : null}
                          </div>
                          <span className="font-mono text-xs text-una-muted">
                            /{prod.slug}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-una-soft-text font-medium">
                      {prod.category}
                    </td>
                    <td className="px-5 py-4 font-bold text-una-deep">
                      {formatPrice(prod.price_start_from)}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-una-soft px-3 py-1 text-xs font-bold text-una-teal">
                        {prod.variants?.length || 0} varian
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                          prod.is_active
                            ? "bg-emerald-50 text-emerald-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`size-1.5 rounded-full ${
                            prod.is_active ? "bg-emerald-600" : "bg-gray-400"
                          }`}
                        />
                        {prod.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(prod)}
                          className="motion-button rounded-md border border-una-deep/20 px-3 py-1.5 text-xs font-bold text-una-deep hover:bg-una-soft"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => confirmDelete(prod)}
                          className="motion-button rounded-md bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Form (Tambah / Edit Produk) */}
      {isFormModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-black/10 pb-4">
              <div>
                <h3 className="text-xl font-black text-una-ink">
                  {editingProduct ? `Edit Produk: ${editingProduct.name}` : "Tambah Produk Baru"}
                </h3>
                <p className="text-xs text-una-muted">
                  {editingProduct
                    ? "Perubahan akan disimpan langsung dalam satu transaksi database atomik."
                    : "Lengkapi form produk dan varian harganya di bawah ini."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="rounded-lg p-2 text-una-muted hover:bg-una-soft hover:text-una-ink"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-6 space-y-6">
              {/* Basic Info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-una-muted">
                    Nama Produk <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Contoh: JWS RGB 2 Panel"
                    className="mt-1 w-full rounded-lg border border-black/20 px-3.5 py-2 text-sm text-una-ink focus:border-una-teal focus:outline-none"
                  />
                  {fieldErrors.name ? (
                    <p className="mt-1 text-xs font-bold text-red-600">{fieldErrors.name}</p>
                  ) : null}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-una-muted">
                    Slug URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={(e) => {
                      setFormSlug(e.target.value);
                      setFormSlugManuallyEdited(true);
                    }}
                    placeholder="contoh: jws-rgb-2-panel"
                    className="mt-1 w-full rounded-lg border border-black/20 px-3.5 py-2 font-mono text-sm text-una-ink focus:border-una-teal focus:outline-none"
                  />
                  {fieldErrors.slug ? (
                    <p className="mt-1 text-xs font-bold text-red-600">{fieldErrors.slug}</p>
                  ) : null}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-una-muted">
                    Kategori <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={categories.includes(formCategory) ? formCategory : CUSTOM_CATEGORY_VALUE}
                    onChange={(e) => {
                      setFormCategory(e.target.value === CUSTOM_CATEGORY_VALUE ? "" : e.target.value);
                    }}
                    className="mt-1 w-full rounded-lg border border-black/20 px-3.5 py-2 text-sm text-una-ink focus:border-una-teal focus:outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value={CUSTOM_CATEGORY_VALUE}>Kategori Baru</option>
                  </select>
                  {!categories.includes(formCategory) ? (
                    <input
                      type="text"
                      required
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      placeholder="Contoh: Running Text Custom"
                      className="mt-2 w-full rounded-lg border border-black/20 px-3.5 py-2 text-sm text-una-ink focus:border-una-teal focus:outline-none"
                    />
                  ) : null}
                  {fieldErrors.category ? (
                    <p className="mt-1 text-xs font-bold text-red-600">{fieldErrors.category}</p>
                  ) : null}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-una-muted">
                    Harga Mulai Dari (Rp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formPriceStart}
                    onChange={(e) => setFormPriceStart(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-black/20 px-3.5 py-2 text-sm text-una-ink focus:border-una-teal focus:outline-none"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-una-muted">
                    Deskripsi Singkat (Short Description) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={formShortDesc}
                    onChange={(e) => setFormShortDesc(e.target.value)}
                    placeholder="Ringkasan 1-2 kalimat untuk kartu produk di katalog..."
                    className="mt-1 w-full rounded-lg border border-black/20 px-3.5 py-2 text-sm text-una-ink focus:border-una-teal focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-una-muted">
                    Deskripsi Lengkap <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Jelaskan spesifikasi, keunggulan, dan cara kerja produk secara mendetail..."
                    className="mt-1 w-full rounded-lg border border-black/20 px-3.5 py-2 text-sm text-una-ink focus:border-una-teal focus:outline-none"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-una-muted">
                      Dimensi Fisik (Opsional)
                    </label>
                    <input
                      type="text"
                      value={formDimensions}
                      onChange={(e) => setFormDimensions(e.target.value)}
                      placeholder="Contoh: 68 x 20 x 5 cm"
                      className="mt-1 w-full rounded-lg border border-black/20 px-3.5 py-2 text-sm text-una-ink focus:border-una-teal focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-una-muted">
                      Urutan Tampil (Order Index)
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formOrderIndex}
                      onChange={(e) => setFormOrderIndex(Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border border-black/20 px-3.5 py-2 text-sm text-una-ink focus:border-una-teal focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-una-muted">
                  Daftar Fitur Unggulan
                </label>
                <p className="text-xs text-una-muted">
                  Tuliskan 1 fitur per baris. Tekan Enter untuk fitur berikutnya.
                </p>
                <textarea
                  rows={4}
                  value={formFeaturesText}
                  onChange={(e) => setFormFeaturesText(e.target.value)}
                  placeholder="Jadwal sholat otomatis akurat&#10;Kontrol via aplikasi Android&#10;Buzzer tanda masuk waktu sholat"
                  className="mt-1 w-full rounded-lg border border-black/20 px-3.5 py-2 font-mono text-sm text-una-ink focus:border-una-teal focus:outline-none"
                />
              </div>

              <div className="grid gap-4 rounded-xl border border-black/10 bg-una-soft/40 p-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-una-muted">
                    Gambar Produk
                  </label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={(e) => void handleProductImageUpload(e.target.files?.[0])}
                    className="mt-1 w-full rounded-lg border border-black/20 bg-white px-3.5 py-2 text-sm text-una-ink file:mr-3 file:rounded-md file:border-0 file:bg-una-deep file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white"
                  />
                  <input
                    type="url"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="URL gambar akan terisi setelah upload"
                    className="mt-2 w-full rounded-lg border border-black/20 bg-white px-3.5 py-2 text-sm text-una-ink focus:border-una-teal focus:outline-none"
                  />
                  {isUploadingProductImage ? (
                    <p className="mt-1 text-xs font-bold text-una-teal">Mengupload gambar...</p>
                  ) : null}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-una-muted">
                    Video YouTube Produk
                  </label>
                  <input
                    type="url"
                    value={formVideoUrl}
                    onChange={(e) => setFormVideoUrl(e.target.value)}
                    placeholder="https://youtu.be/... atau https://youtube.com/watch?v=..."
                    className="mt-1 w-full rounded-lg border border-black/20 bg-white px-3.5 py-2 text-sm text-una-ink focus:border-una-teal focus:outline-none"
                  />
                  <p className="mt-1 text-xs text-una-muted">
                    Video akan tampil embed di detail produk jika URL YouTube valid.
                  </p>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-6 rounded-xl bg-una-soft/60 p-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-una-ink">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="size-4 rounded text-una-teal focus:ring-una-teal"
                  />
                  <span>⭐ Jadikan Produk Unggulan (Featured)</span>
                </label>

                <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-una-ink">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="size-4 rounded text-una-teal focus:ring-una-teal"
                  />
                  <span>✅ Aktif & Tampilkan di Website Publik</span>
                </label>
              </div>

              {/* Variants Section */}
              <div className="space-y-4 border-t border-black/10 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-black text-una-ink">Varian Produk & Harga</h4>
                    <p className="text-xs text-una-muted">
                      Minimal ada 1 varian. Setiap varian akan disimpan dalam transaksi atomik.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="rounded-lg bg-una-deep px-3 py-1.5 text-xs font-bold text-white hover:bg-una-emerald"
                  >
                    + Tambah Varian
                  </button>
                </div>

                <div className="space-y-3">
                  {formVariants.map((varItem, idx) => (
                    <div
                      key={idx}
                      className="grid gap-3 rounded-xl border border-black/15 bg-[#fafaf5] p-4 sm:grid-cols-[1.5fr_1fr_1.5fr_auto] sm:items-center"
                    >
                      <div>
                        <label className="block text-[0.65rem] font-bold uppercase text-una-muted">
                          Nama Varian
                        </label>
                        <input
                          type="text"
                          required
                          value={varItem.name}
                          onChange={(e) => updateVariantField(idx, "name", e.target.value)}
                          placeholder="Standard / Plus Murottal"
                          className="mt-1 w-full rounded-md border border-black/20 bg-white px-2.5 py-1.5 text-xs text-una-ink"
                        />
                      </div>

                      <div>
                        <label className="block text-[0.65rem] font-bold uppercase text-una-muted">
                          Harga (Rp)
                        </label>
                        <input
                          type="number"
                          required
                          min={0}
                          value={varItem.price}
                          onChange={(e) => updateVariantField(idx, "price", Number(e.target.value))}
                          className="mt-1 w-full rounded-md border border-black/20 bg-white px-2.5 py-1.5 text-xs text-una-ink"
                        />
                      </div>

                      <div>
                        <label className="block text-[0.65rem] font-bold uppercase text-una-muted">
                          Keterangan Varian (Opsional)
                        </label>
                        <input
                          type="text"
                          value={varItem.description || ""}
                          onChange={(e) => updateVariantField(idx, "description", e.target.value)}
                          placeholder="Termasuk adaptor & bracket..."
                          className="mt-1 w-full rounded-md border border-black/20 bg-white px-2.5 py-1.5 text-xs text-una-ink"
                        />
                      </div>

                      <div className="flex justify-end pt-3 sm:pt-0">
                        {formVariants.length > 1 ? (
                          <button
                            type="button"
                            onClick={() => removeVariant(idx)}
                            className="rounded p-1.5 text-red-600 hover:bg-red-100"
                            title="Hapus Varian"
                          >
                            🗑️
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 border-t border-black/10 pt-6">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  disabled={isPending}
                  className="rounded-xl border border-black/20 px-5 py-2.5 text-sm font-bold text-una-ink hover:bg-una-soft disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="gold-cta motion-button inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-black shadow-md disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <span className="size-4 animate-spin rounded-full border-2 border-una-gold-ink border-t-transparent" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>{editingProduct ? "Simpan Perubahan" : "Buat Produk Sekarang"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && deletingProduct ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-black text-una-ink">Hapus Produk Permanen?</h3>
            <p className="mt-2 text-sm leading-6 text-una-muted">
              Apakah anda yakin ingin menghapus produk <strong className="text-una-ink">{deletingProduct.name}</strong>?
              Semua varian produk ini juga akan dihapus dalam transaksi database. Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isPending}
                className="rounded-xl border border-black/20 px-4 py-2 text-sm font-bold text-una-ink hover:bg-una-soft disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteSubmit}
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2 text-sm font-black text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <span>Ya, Hapus Permanen</span>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
