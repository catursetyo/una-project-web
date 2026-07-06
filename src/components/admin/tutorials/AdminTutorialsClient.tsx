"use client";

import { useState, useTransition, useMemo } from "react";
import type { ApiTutorial, ApiTutorialStep } from "@/src/types/tutorial";
import {
  createTutorialAction,
  updateTutorialAction,
  deleteTutorialAction,
  type TutorialInputData,
} from "@/src/app/admin/(dashboard)/tutorials/actions";

type AdminTutorialsClientProps = {
  initialTutorials: ApiTutorial[];
};

export function AdminTutorialsClient({ initialTutorials }: AdminTutorialsClientProps) {
  const tutorials = initialTutorials;
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ApiTutorial | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<ApiTutorial | null>(null);

  // Feedback state
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formSlugManuallyEdited, setFormSlugManuallyEdited] = useState(false);
  const [formCategory, setFormCategory] = useState("Pengaturan JWS");
  const [formShortDesc, setFormShortDesc] = useState("");
  const [formVideoUrl, setFormVideoUrl] = useState("");
  const [formOrderIndex, setFormOrderIndex] = useState<number>(1);
  const [formIsActive, setFormIsActive] = useState(true);
  const [formSteps, setFormSteps] = useState<ApiTutorialStep[]>([]);

  // Unique categories
  const categories = useMemo(() => {
    const cats = new Set(tutorials.map((t) => t.category));
    if (!cats.has("Pengaturan JWS")) cats.add("Pengaturan JWS");
    if (!cats.has("Instalasi Hardware")) cats.add("Instalasi Hardware");
    if (!cats.has("Aplikasi Android")) cats.add("Aplikasi Android");
    return Array.from(cats);
  }, [tutorials]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return tutorials.filter((item) => {
      const matchQuery =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.slug.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = filterCategory === "ALL" || item.category === filterCategory;
      return matchQuery && matchCat;
    });
  }, [tutorials, searchQuery, filterCategory]);

  function handleTitleChange(val: string) {
    setFormTitle(val);
    if (!formSlugManuallyEdited && !editingItem) {
      const slugified = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      setFormSlug(slugified);
    }
  }

  function openCreateModal() {
    setEditingItem(null);
    setFormTitle("");
    setFormSlug("");
    setFormSlugManuallyEdited(false);
    setFormCategory("Pengaturan JWS");
    setFormShortDesc("");
    setFormVideoUrl("");
    setFormOrderIndex(tutorials.length + 1);
    setFormIsActive(true);
    setFormSteps([
      {
        step_number: 1,
        title: "Persiapan Perangkat",
        description: "Pastikan JWS terhubung ke sumber daya listrik dengan adaptor 5V yang sesuai.",
        highlight: "Perhatikan polaritas kabel",
      },
    ]);
    setFieldErrors({});
    setFeedback(null);
    setIsFormModalOpen(true);
  }

  function openEditModal(item: ApiTutorial) {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormSlug(item.slug);
    setFormSlugManuallyEdited(true);
    setFormCategory(item.category);
    setFormShortDesc(item.short_description);
    setFormVideoUrl(item.video_url || "");
    setFormOrderIndex(item.order_index);
    setFormIsActive(item.is_active);
    setFormSteps(
      (item.steps || []).map((s, idx) => ({
        step_number: s.step_number || idx + 1,
        title: s.title,
        description: s.description,
        highlight: s.highlight || "",
      }))
    );
    setFieldErrors({});
    setFeedback(null);
    setIsFormModalOpen(true);
  }

  function openDeleteModal(item: ApiTutorial) {
    setDeletingItem(item);
    setFeedback(null);
    setIsDeleteModalOpen(true);
  }

  function handleAddStep() {
    setFormSteps((prev) => [
      ...prev,
      {
        step_number: prev.length + 1,
        title: "",
        description: "",
        highlight: "",
      },
    ]);
  }

  function handleRemoveStep(index: number) {
    setFormSteps((prev) => prev.filter((_, i) => i !== index));
  }

  function handleStepChange(index: number, field: keyof ApiTutorialStep, value: string | number) {
    setFormSteps((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    setFeedback(null);

    const payload: TutorialInputData = {
      title: formTitle.trim(),
      slug: formSlug.trim(),
      category: formCategory.trim(),
      short_description: formShortDesc.trim(),
      video_url: formVideoUrl.trim() || undefined,
      order_index: Number(formOrderIndex) || 1,
      is_active: formIsActive,
      steps: formSteps.map((s, idx) => ({
        step_number: idx + 1,
        title: s.title.trim(),
        description: s.description.trim(),
        highlight: s.highlight?.trim() || undefined,
      })),
    };

    startTransition(async () => {
      const res = editingItem
        ? await updateTutorialAction(editingItem.id, payload)
        : await createTutorialAction(payload);

      if (res.success) {
        setIsFormModalOpen(false);
        setFeedback({ type: "success", text: res.message || "Berhasil disimpan!" });
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
      const res = await deleteTutorialAction(deletingItem.id);
      if (res.success) {
        setIsDeleteModalOpen(false);
        setFeedback({ type: "success", text: res.message || "Tutorial berhasil dihapus!" });
      } else {
        setFeedback({ type: "error", text: res.error || "Gagal menghapus tutorial." });
      }
    });
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-una-deep">Manajemen Tutorial</h1>
          <p className="text-sm text-una-muted">
            Kelola panduan penggunaan, langkah instalasi, dan video tutorial produk JWS.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-una-gold px-4 py-2.5 text-sm font-black text-una-gold-ink transition-colors hover:bg-una-gold-light"
        >
          <span>+</span> Tambah Tutorial
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
            placeholder="Cari judul atau slug tutorial..."
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
                <th className="px-6 py-4">No.</th>
                <th className="px-6 py-4">Judul & Slug</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Langkah</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-una-muted">
                    Tidak ada data tutorial yang sesuai.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, index) => (
                  <tr key={item.id} className="transition-colors hover:bg-stone-50/50">
                    <td className="px-6 py-4 font-bold text-una-muted">
                      {item.order_index || index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-una-deep">{item.title}</div>
                      <div className="mt-0.5 font-mono text-xs text-una-gold-ink/70">
                        /{item.slug}
                      </div>
                      <div className="mt-1 line-clamp-1 text-xs text-una-muted max-w-md">
                        {item.short_description}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-md bg-stone-100 px-2.5 py-1 text-xs font-semibold text-una-deep">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-una-deep">
                      {item.steps?.length || 0} langkah
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
          <div className="max-h-[90dvh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h2 className="text-xl font-bold text-una-deep">
                {editingItem ? "Edit Tutorial" : "Tambah Tutorial Baru"}
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
              {/* Title and Slug */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-una-deep">
                    Judul Tutorial <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={150}
                    value={formTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Contoh: Cara Setel Jam via Aplikasi"
                    className="mt-1.5 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-una-deep focus:border-una-gold focus:bg-white focus:outline-none"
                  />
                  {fieldErrors.title && (
                    <p className="mt-1 text-xs font-semibold text-rose-500">{fieldErrors.title}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-una-deep">
                    Slug URL <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={(e) => {
                      setFormSlug(e.target.value);
                      setFormSlugManuallyEdited(true);
                    }}
                    placeholder="cara-setel-jam"
                    className="mt-1.5 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 font-mono text-sm text-una-deep focus:border-una-gold focus:bg-white focus:outline-none"
                  />
                  {fieldErrors.slug && (
                    <p className="mt-1 text-xs font-semibold text-rose-500">{fieldErrors.slug}</p>
                  )}
                </div>
              </div>

              {/* Category and Order Index */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-una-deep">
                    Kategori <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    list="category-suggestions"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-una-deep focus:border-una-gold focus:bg-white focus:outline-none"
                  />
                  <datalist id="category-suggestions">
                    <option value="Pengaturan JWS" />
                    <option value="Instalasi Hardware" />
                    <option value="Aplikasi Android" />
                  </datalist>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-una-deep">
                    Urutan Tampil
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formOrderIndex}
                    onChange={(e) => setFormOrderIndex(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-una-deep focus:border-una-gold focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-una-deep">
                  Deskripsi Singkat <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  placeholder="Rangkuman singkat panduan ini untuk ditampilkan pada kartu katalog tutorial..."
                  className="mt-1.5 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-una-deep focus:border-una-gold focus:bg-white focus:outline-none"
                />
                {fieldErrors.short_description && (
                  <p className="mt-1 text-xs font-semibold text-rose-500">{fieldErrors.short_description}</p>
                )}
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-una-deep">
                  URL Video Tutorial (Opsional)
                </label>
                <input
                  type="url"
                  value={formVideoUrl}
                  onChange={(e) => setFormVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="mt-1.5 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-una-deep focus:border-una-gold focus:bg-white focus:outline-none"
                />
              </div>

              {/* Steps Editor Section */}
              <div className="border-t border-stone-100 pt-5">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-una-deep">
                    Langkah-Langkah Tutorial ({formSteps.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddStep}
                    className="rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-bold text-una-deep hover:bg-stone-200 transition-colors"
                  >
                    + Tambah Langkah
                  </button>
                </div>

                <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                  {formSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="relative rounded-2xl border border-stone-200/80 bg-stone-50/60 p-4 transition-all hover:border-una-gold/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-una-gold-ink bg-una-gold/20 px-2 py-0.5 rounded-md">
                          Langkah #{idx + 1}
                        </span>
                        {formSteps.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveStep(idx)}
                            className="text-xs font-bold text-rose-500 hover:text-rose-700"
                          >
                            Hapus
                          </button>
                        )}
                      </div>

                      <div className="space-y-3">
                        <input
                          type="text"
                          required
                          placeholder="Judul Langkah (contoh: Nyalakan Bluetooth HP)"
                          value={step.title}
                          onChange={(e) => handleStepChange(idx, "title", e.target.value)}
                          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-semibold text-una-deep focus:border-una-gold focus:outline-none"
                        />
                        <textarea
                          required
                          rows={2}
                          placeholder="Penjelasan detail langkah ini..."
                          value={step.description}
                          onChange={(e) => handleStepChange(idx, "description", e.target.value)}
                          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-una-deep focus:border-una-gold focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Catatan penting / Highlight (opsional)"
                          value={step.highlight || ""}
                          onChange={(e) => handleStepChange(idx, "highlight", e.target.value)}
                          className="w-full rounded-xl border border-amber-200/60 bg-amber-50/40 px-3 py-1.5 text-xs text-amber-900 placeholder:text-amber-700/50 focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Is Active Toggle */}
              <div className="flex items-center gap-3 rounded-xl bg-stone-50 p-3 border border-stone-200/60">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="size-4 rounded border-stone-300 text-una-gold focus:ring-una-gold"
                />
                <label htmlFor="isActive" className="text-sm font-bold text-una-deep select-none cursor-pointer">
                  Tampilkan tutorial ini di website depan (Aktif)
                </label>
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
                  {isPending ? "Menyimpan..." : "Simpan Tutorial"}
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
            <h3 className="text-lg font-bold text-una-deep">Hapus Tutorial</h3>
            <p className="mt-2 text-sm text-una-muted">
              Apakah Anda yakin ingin menghapus tutorial{" "}
              <span className="font-bold text-una-deep">&quot;{deletingItem.title}&quot;</span> beserta seluruh langkah-langkahnya? Tindakan ini tidak dapat dibatalkan.
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
