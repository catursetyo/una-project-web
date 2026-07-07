"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { ApiWhatsAppTemplate } from "@/src/types/whatsappTemplate";
import {
  createWhatsAppTemplateAction,
  updateWhatsAppTemplateAction,
  deleteWhatsAppTemplateAction,
  type WhatsAppTemplateInputData,
} from "@/src/app/admin/(dashboard)/whatsapp-templates/actions";

type AdminWhatsAppTemplatesClientProps = {
  initialTemplates: ApiWhatsAppTemplate[];
};

const CUSTOM_CATEGORY_VALUE = "__custom_category__";
const DEFAULT_TEMPLATE_CATEGORIES = ["Konsultasi", "Produk", "Katalog", "Dukungan"];

export function AdminWhatsAppTemplatesClient({ initialTemplates }: AdminWhatsAppTemplatesClientProps) {
  const router = useRouter();
  const templates = initialTemplates;
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ApiWhatsAppTemplate | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<ApiWhatsAppTemplate | null>(null);

  // Feedback state
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  // Form state
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Konsultasi");
  const [formMessage, setFormMessage] = useState("");
  const [formIsDefault, setFormIsDefault] = useState(false);
  const [formIsActive, setFormIsActive] = useState(true);

  // Unique categories
  const categories = useMemo(() => {
    const cats = new Set([...DEFAULT_TEMPLATE_CATEGORIES, ...templates.map((t) => t.category)]);
    return Array.from(cats);
  }, [templates]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return templates.filter((item) => {
      const matchQuery =
        item.template_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.message_pattern.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = filterCategory === "ALL" || item.category === filterCategory;
      return matchQuery && matchCat;
    });
  }, [templates, searchQuery, filterCategory]);

  function handleNameChange(val: string) {
    // Format snake_case for template name
    const formatted = val
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "_")
      .replace(/_+/g, "_");
    setFormName(formatted);
  }

  function insertPlaceholder(tag: string) {
    setFormMessage((prev) => `${prev} ${tag}`.trim());
  }

  function openCreateModal() {
    setEditingItem(null);
    setFormName("");
    setFormCategory("Konsultasi");
    setFormMessage("Assalamualaikum UNA Project, saya ingin bertanya mengenai {product_name}. Mohon informasinya.");
    setFormIsDefault(false);
    setFormIsActive(true);
    setFieldErrors({});
    setFeedback(null);
    setIsFormModalOpen(true);
  }

  function openEditModal(item: ApiWhatsAppTemplate) {
    setEditingItem(item);
    setFormName(item.template_name);
    setFormCategory(item.category);
    setFormMessage(item.message_pattern);
    setFormIsDefault(item.is_default);
    setFormIsActive(item.is_active);
    setFieldErrors({});
    setFeedback(null);
    setIsFormModalOpen(true);
  }

  function openDeleteModal(item: ApiWhatsAppTemplate) {
    setDeletingItem(item);
    setFeedback(null);
    setIsDeleteModalOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    setFeedback(null);

    const payload: WhatsAppTemplateInputData = {
      template_name: formName.trim(),
      category: formCategory.trim(),
      message_pattern: formMessage.trim(),
      is_default: formIsDefault,
      is_active: formIsActive,
    };

    startTransition(async () => {
      const res = editingItem
        ? await updateWhatsAppTemplateAction(editingItem.id, payload)
        : await createWhatsAppTemplateAction(payload);

      if (res.success) {
        setIsFormModalOpen(false);
        setFeedback({ type: "success", text: res.message || "Berhasil disimpan!" });
        router.refresh();
      } else {
        setFeedback({ type: "error", text: res.error || "Gagal menyimpan data." });
        if (res.errors) {
          setFieldErrors(res.errors);
        }
      }
    });
  }

  function handleDelete() {
    if (!deletingItem) return;
    startTransition(async () => {
      const res = await deleteWhatsAppTemplateAction(deletingItem.id);
      if (res.success) {
        setIsDeleteModalOpen(false);
        setFeedback({ type: "success", text: res.message || "Template WhatsApp berhasil dihapus!" });
        router.refresh();
      } else {
        setFeedback({ type: "error", text: res.error || "Gagal menghapus template WhatsApp." });
      }
    });
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-una-deep">Manajemen Template WhatsApp</h1>
          <p className="text-sm text-una-muted">
            Kelola pola pesan dinamis untuk tombol CTA WhatsApp dengan variabel seperti &#123;product_name&#125;.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-una-gold px-4 py-2.5 text-sm font-black text-una-gold-ink transition-colors hover:bg-una-gold-light"
        >
          <span>+</span> Tambah Template Baru
        </button>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`flex items-center justify-between rounded-xl p-4 text-sm font-medium shadow-sm ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          <span>{feedback.text}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="ml-4 font-bold opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm border border-stone-100 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Cari nama template atau isi pesan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-una-deep placeholder:text-stone-400 focus:border-una-gold focus:bg-white focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-una-muted">Kategori:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-medium text-una-deep focus:border-una-gold focus:bg-white focus:outline-none"
          >
            <option value="ALL">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-stone-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/75 text-xs font-bold uppercase tracking-wider text-una-muted">
                <th className="px-6 py-4">Nama Template</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Pola Pesan Dinamis</th>
                <th className="px-6 py-4">Default</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-una-muted">
                    Tidak ada data template WhatsApp yang sesuai.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-stone-50/50">
                    <td className="px-6 py-4">
                      <div className="font-mono font-bold text-una-deep bg-stone-100 px-2 py-1 rounded-md inline-block text-xs">
                        {item.template_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-una-deep">
                      {item.category}
                    </td>
                    <td className="px-6 py-4">
                      <div className="line-clamp-2 text-xs text-una-muted max-w-md font-sans">
                        {item.message_pattern}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.is_default ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200/60">
                          🌟 Default
                        </span>
                      ) : (
                        <span className="text-xs text-stone-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                          item.is_active
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                            : "bg-stone-100 text-stone-600 border border-stone-200/60"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            item.is_active ? "bg-emerald-500" : "bg-stone-400"
                          }`}
                        />
                        {item.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-bold text-una-deep hover:bg-stone-50 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => openDeleteModal(item)}
                          className="rounded-lg border border-rose-100 bg-rose-50/50 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100/50 transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h2 className="text-xl font-bold text-una-deep">
                {editingItem ? "Edit Template WhatsApp" : "Tambah Template Baru"}
              </h2>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="rounded-full p-2 text-una-muted hover:bg-stone-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {/* Template Name and Category */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-una-deep">
                    Nama Template (snake_case) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={formName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="tanya_produk"
                    className="mt-1.5 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 font-mono text-sm font-bold text-una-deep focus:border-una-gold focus:bg-white focus:outline-none"
                  />
                  {fieldErrors.template_name && (
                    <p className="mt-1 text-xs font-semibold text-rose-500">{fieldErrors.template_name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-una-deep">
                    Kategori <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={categories.includes(formCategory) ? formCategory : CUSTOM_CATEGORY_VALUE}
                    onChange={(e) => {
                      setFormCategory(e.target.value === CUSTOM_CATEGORY_VALUE ? "" : e.target.value);
                    }}
                    className="mt-1.5 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-una-deep focus:border-una-gold focus:bg-white focus:outline-none"
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
                      maxLength={50}
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      placeholder="Contoh: Promo Ramadan"
                      className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-una-deep focus:border-una-gold focus:outline-none"
                    />
                  ) : null}
                  <p className="mt-1 text-xs text-una-muted">
                    CTA website saat ini memakai kategori Konsultasi dan Produk. Kategori baru tersimpan, tetapi baru dipakai jika ada CTA yang memanggil kategori itu.
                  </p>
                  {fieldErrors.category && (
                    <p className="mt-1 text-xs font-semibold text-rose-500">{fieldErrors.category}</p>
                  )}
                </div>
              </div>

              {/* Message Pattern with Helper Buttons */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-una-deep">
                    Pola Pesan Dinamis <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-una-muted font-medium">Sisipkan:</span>
                    <button
                      type="button"
                      onClick={() => insertPlaceholder("{product_name}")}
                      className="rounded bg-una-gold/20 px-2 py-0.5 font-mono font-bold text-una-gold-ink hover:bg-una-gold/40"
                    >
                      + &#123;product_name&#125;
                    </button>
                    <button
                      type="button"
                      onClick={() => insertPlaceholder("{price}")}
                      className="rounded bg-una-gold/20 px-2 py-0.5 font-mono font-bold text-una-gold-ink hover:bg-una-gold/40"
                    >
                      + &#123;price&#125;
                    </button>
                    <button
                      type="button"
                      onClick={() => insertPlaceholder("{category}")}
                      className="rounded bg-una-gold/20 px-2 py-0.5 font-mono font-bold text-una-gold-ink hover:bg-una-gold/40"
                    >
                      + &#123;category&#125;
                    </button>
                  </div>
                </div>
                <textarea
                  required
                  rows={4}
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="Halo UNA Project, saya tertarik dengan produk {product_name}..."
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-una-deep focus:border-una-gold focus:bg-white focus:outline-none"
                />
                <p className="mt-1 text-xs text-una-muted">
                  Variabel seperti <code className="font-mono bg-stone-100 px-1 py-0.5 rounded">&#123;product_name&#125;</code> akan otomatis diganti dengan nama produk yang di-klik pengguna di website depan.
                </p>
                {fieldErrors.message_pattern && (
                  <p className="mt-1 text-xs font-semibold text-rose-500">{fieldErrors.message_pattern}</p>
                )}
              </div>

              {/* Toggles */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 rounded-xl bg-amber-50/50 p-3 border border-amber-200/60">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={formIsDefault}
                    onChange={(e) => setFormIsDefault(e.target.checked)}
                    className="size-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="isDefault" className="text-sm font-bold text-amber-900 select-none cursor-pointer">
                    🌟 Jadikan template default untuk kategori &quot;{formCategory || "ini"}&quot;
                  </label>
                </div>
                <p className="text-xs leading-5 text-una-muted">
                  Jika satu kategori punya beberapa template aktif, hanya template default yang dipakai CTA. Jika default terhapus/nonaktif, backend otomatis memilih template aktif tertua sebagai default agar CTA tidak kosong.
                </p>

                <div className="flex items-center gap-3 rounded-xl bg-stone-50 p-3 border border-stone-200/60">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="size-4 rounded border-stone-300 text-una-gold focus:ring-una-gold"
                  />
                  <label htmlFor="isActive" className="text-sm font-bold text-una-deep select-none cursor-pointer">
                    Aktifkan template ini
                  </label>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-stone-100 pt-5">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="rounded-xl border border-stone-200 bg-white px-5 py-2.5 text-sm font-bold text-una-muted hover:bg-stone-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-xl bg-una-gold px-6 py-2.5 text-sm font-bold text-una-gold-ink shadow-md hover:brightness-105 disabled:opacity-50"
                >
                  {isPending ? "Menyimpan..." : "Simpan Template"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-una-deep">Hapus Template WhatsApp</h3>
            <p className="mt-2 text-sm text-una-muted">
              Apakah Anda yakin ingin menghapus template{" "}
              <span className="font-mono font-bold text-una-deep bg-stone-100 px-1.5 py-0.5 rounded">&quot;{deletingItem.template_name}&quot;</span>? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-bold text-una-muted hover:bg-stone-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="rounded-xl bg-rose-600 px-5 py-2 text-sm font-bold text-white shadow-md hover:bg-rose-700 disabled:opacity-50"
              >
                {isPending ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
