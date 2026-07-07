"use client";

import { useState, useTransition, useMemo } from "react";
import type { ApiTestimonial } from "@/src/types/testimonial";
import {
  createTestimonialAction,
  updateTestimonialAction,
  deleteTestimonialAction,
  type TestimonialInputData,
} from "@/src/app/admin/(dashboard)/testimonials/actions";
import { uploadMediaAction } from "@/src/app/admin/(dashboard)/uploads/actions";

type AdminTestimonialsClientProps = {
  initialTestimonials: ApiTestimonial[];
};

export function AdminTestimonialsClient({ initialTestimonials }: AdminTestimonialsClientProps) {
  const testimonials = initialTestimonials;
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ApiTestimonial | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<ApiTestimonial | null>(null);

  // Feedback state
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formImageAlt, setFormImageAlt] = useState("");
  const [formOrderIndex, setFormOrderIndex] = useState<number>(1);
  const [formIsActive, setFormIsActive] = useState(true);

  // Filtered items
  const filteredItems = useMemo(() => {
    return testimonials.filter((item) => {
      const matchQuery =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.image_alt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus =
        filterStatus === "ALL" ||
        (filterStatus === "ACTIVE" && item.is_active) ||
        (filterStatus === "INACTIVE" && !item.is_active);
      return matchQuery && matchStatus;
    });
  }, [testimonials, searchQuery, filterStatus]);

  function openCreateModal() {
    setEditingItem(null);
    setFormTitle("");
    setFormDescription("");
    setFormImageUrl("");
    setFormImageAlt("");
    setFormOrderIndex(testimonials.length + 1);
    setFormIsActive(true);
    setFieldErrors({});
    setFeedback(null);
    setIsFormModalOpen(true);
  }

  function openEditModal(item: ApiTestimonial) {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormDescription(item.description);
    setFormImageUrl(item.image_url || "");
    setFormImageAlt(item.image_alt);
    setFormOrderIndex(item.order_index);
    setFormIsActive(item.is_active);
    setFieldErrors({});
    setFeedback(null);
    setIsFormModalOpen(true);
  }

  function openDeleteModal(item: ApiTestimonial) {
    setDeletingItem(item);
    setFeedback(null);
    setIsDeleteModalOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    setFeedback(null);

    const payload: TestimonialInputData = {
      title: formTitle.trim(),
      description: formDescription.trim(),
      rating: editingItem?.rating ?? 5,
      image_url: formImageUrl.trim() || undefined,
      image_alt: formImageAlt.trim() || `Dokumentasi ${formTitle.trim()}`,
      role_location: editingItem?.role_location,
      order_index: Number(formOrderIndex) || 1,
      is_active: formIsActive,
    };

    startTransition(async () => {
      const res = editingItem
        ? await updateTestimonialAction(editingItem.id, payload)
        : await createTestimonialAction(payload);

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

  async function handleImageUpload(file?: File) {
    if (!file) return;
    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append("kind", "testimonials");
    formData.append("file", file);
    const res = await uploadMediaAction(formData);
    setIsUploadingImage(false);
    if (res.success && res.url) {
      setFormImageUrl(res.url);
      setFeedback({ type: "success", text: "Gambar testimoni berhasil diupload." });
      return;
    }
    setFeedback({ type: "error", text: res.error || "Upload gambar gagal." });
  }

  function handleDelete() {
    if (!deletingItem) return;
    startTransition(async () => {
      const res = await deleteTestimonialAction(deletingItem.id);
      if (res.success) {
        setIsDeleteModalOpen(false);
        setFeedback({ type: "success", text: res.message || "Testimoni berhasil dihapus!" });
      } else {
        setFeedback({ type: "error", text: res.error || "Gagal menghapus testimoni." });
      }
    });
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-una-deep">Manajemen Testimoni</h1>
          <p className="text-sm text-una-muted">
            Kelola gambar dokumentasi dan keterangan singkat yang tampil pada bagian Testimoni.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-una-gold px-4 py-2.5 text-sm font-black text-una-gold-ink transition-colors hover:bg-una-gold-light"
        >
          <span>+</span> Tambah Testimoni
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
      <div className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-white p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Cari judul atau keterangan gambar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-una-deep placeholder:text-stone-400 focus:border-una-gold focus:bg-white focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-una-muted">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as "ALL" | "ACTIVE" | "INACTIVE")}
            className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-medium text-una-deep focus:border-una-gold focus:bg-white focus:outline-none"
          >
            <option value="ALL">Semua</option>
            <option value="ACTIVE">Aktif saja</option>
            <option value="INACTIVE">Nonaktif</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/75 text-xs font-bold uppercase tracking-wider text-una-muted">
                <th className="px-6 py-4">No.</th>
                <th className="px-6 py-4">Judul & Keterangan</th>
                <th className="px-6 py-4">Media</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-una-muted">
                    Tidak ada data testimoni yang sesuai.
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
                      <div className="mt-1 line-clamp-2 text-xs text-una-muted max-w-md">
                        {item.description}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="block max-w-64 text-xs text-una-muted">
                        {item.image_url ? "Gambar tersimpan" : "Placeholder gambar"}
                      </span>
                      <span className="mt-1 block max-w-64 truncate text-xs text-stone-400">
                        {item.image_alt}
                      </span>
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
                {editingItem ? "Edit Testimoni" : "Tambah Testimoni Baru"}
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
              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-una-deep">
                  Judul Dokumentasi / Ulasan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={150}
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Contoh: Pemasangan JWS di Masjid Jami Al-Ikhlas"
                  className="mt-1.5 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-una-deep focus:border-una-gold focus:bg-white focus:outline-none"
                />
                {fieldErrors.title && (
                  <p className="mt-1 text-xs font-semibold text-rose-500">{fieldErrors.title}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-una-deep">
                  Keterangan / Isi Ulasan <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Ceritakan proses pemasangan atau ulasan dari DKM/pelanggan..."
                  className="mt-1.5 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-una-deep focus:border-una-gold focus:bg-white focus:outline-none"
                />
                {fieldErrors.description && (
                  <p className="mt-1 text-xs font-semibold text-rose-500">{fieldErrors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-una-deep">
                    Foto Pemasangan
                  </label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={(e) => void handleImageUpload(e.target.files?.[0])}
                    className="mt-1.5 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-una-deep file:mr-3 file:rounded-md file:border-0 file:bg-una-deep file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white"
                  />
                  <input
                    type="url"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="URL gambar akan terisi setelah upload"
                    className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-una-deep focus:border-una-gold focus:bg-white focus:outline-none"
                  />
                  {isUploadingImage ? (
                    <p className="mt-1 text-xs font-bold text-una-teal">Mengupload gambar...</p>
                  ) : null}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-una-deep">
                    Teks Alternatif Gambar
                  </label>
                  <input
                    type="text"
                    maxLength={255}
                    value={formImageAlt}
                    onChange={(e) => setFormImageAlt(e.target.value)}
                    placeholder="Dokumentasi pemasangan JWS Digital"
                    className="mt-1.5 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-una-deep focus:border-una-gold focus:bg-white focus:outline-none"
                  />
                </div>
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
                  Tampilkan testimoni ini di website depan (Aktif)
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
                  {isPending ? "Menyimpan..." : "Simpan Testimoni"}
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
            <h3 className="text-lg font-bold text-una-deep">Hapus Testimoni</h3>
            <p className="mt-2 text-sm text-una-muted">
              Apakah Anda yakin ingin menghapus testimoni{" "}
              <span className="font-bold text-una-deep">&quot;{deletingItem.title}&quot;</span>? Tindakan ini tidak dapat dibatalkan.
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
