"use client";

import { useState, useTransition } from "react";
import type { ApiOrderStep } from "@/src/types/orderStep";
import {
  replaceAllOrderStepsAction,
  type OrderStepInputData,
} from "@/src/app/admin/(dashboard)/order-steps/actions";
import { transactionSteps } from "@/src/data/transaction";

type AdminOrderStepsClientProps = {
  initialSteps: ApiOrderStep[];
};

export function AdminOrderStepsClient({ initialSteps }: AdminOrderStepsClientProps) {
  const [steps, setSteps] = useState<ApiOrderStep[]>(
    initialSteps.length > 0
      ? initialSteps
      : transactionSteps.map((step, index) => ({
          step_number: step.number,
          title: step.title,
          description: step.description,
          icon_name: "default",
          is_active: true,
          order_index: index + 1,
        })),
  );

  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  function handleAddStep() {
    const nextIdx = steps.length + 1;
    const numStr = nextIdx < 10 ? `0${nextIdx}` : `${nextIdx}`;
    setSteps((prev) => [
      ...prev,
      {
        step_number: numStr,
        title: "",
        description: "",
        icon_name: "default",
        is_active: true,
        order_index: nextIdx,
      },
    ]);
  }

  function handleRemoveStep(index: number) {
    setSteps((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      // Recalculate order_index
      return filtered.map((s, idx) => ({ ...s, order_index: idx + 1 }));
    });
  }

  function handleMoveUp(index: number) {
    if (index === 0) return;
    setSteps((prev) => {
      const next = [...prev];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      return next.map((s, idx) => ({ ...s, order_index: idx + 1 }));
    });
  }

  function handleMoveDown(index: number) {
    if (index === steps.length - 1) return;
    setSteps((prev) => {
      const next = [...prev];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      return next.map((s, idx) => ({ ...s, order_index: idx + 1 }));
    });
  }

  function handleChange(index: number, field: keyof ApiOrderStep, value: string | boolean | number) {
    setSteps((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    setFeedback(null);

    const payload: OrderStepInputData[] = steps.map((s, idx) => ({
      step_number: s.step_number.trim() || (idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`),
      title: s.title.trim(),
      description: s.description.trim(),
      icon_name: s.icon_name || "default",
      is_active: s.is_active,
      order_index: idx + 1,
    }));

    startTransition(async () => {
      const res = await replaceAllOrderStepsAction(payload);
      if (res.success) {
        setFeedback({ type: "success", text: res.message || "Urutan alur pemesanan berhasil disimpan!" });
      } else {
        setFeedback({ type: "error", text: res.error || "Gagal menyimpan urutan alur." });
        if (res.errors) {
          setFieldErrors(res.errors);
        }
      }
    });
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-una-deep">Manajemen Alur Pemesanan</h1>
          <p className="text-sm text-una-muted">
            Atur langkah transaksi pada halaman /order. Tiga langkah di homepage tetap dikelola di kode frontend.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddStep}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-una-gold px-4 py-2.5 text-sm font-black text-una-gold-ink transition-colors hover:bg-una-gold-light"
        >
          <span>+</span> Tambah Langkah Baru
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

      {/* Steps Editor Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          {steps.length === 0 ? (
            <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-12 text-center text-una-muted">
              Belum ada langkah pemesanan. Klik &quot;+ Tambah Langkah Baru&quot; di atas.
            </div>
          ) : (
            steps.map((step, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-stone-200 bg-white p-5 transition-colors hover:border-una-gold/60"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-stone-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="grid size-8 place-items-center rounded-lg bg-una-gold text-sm font-black text-una-gold-ink">
                      #{idx + 1}
                    </span>
                    <span className="text-sm font-bold text-una-deep">
                      Langkah Ke-{idx + 1}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveUp(idx)}
                      className="rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs font-bold text-una-deep hover:bg-stone-100 disabled:opacity-30"
                    >
                      Naik
                    </button>
                    <button
                      type="button"
                      disabled={idx === steps.length - 1}
                      onClick={() => handleMoveDown(idx)}
                      className="rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs font-bold text-una-deep hover:bg-stone-100 disabled:opacity-30"
                    >
                      Turun
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(idx)}
                      className="ml-2 rounded-lg border border-rose-100 bg-rose-50/60 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100"
                    >
                      Hapus
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[10rem_1fr]">
                  {/* Step Number */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-una-deep">
                      Nomor Tampil (Contoh: 01) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={10}
                      value={step.step_number}
                      onChange={(e) => handleChange(idx, "step_number", e.target.value)}
                      placeholder="01"
                      className="mt-1.5 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2 text-sm font-bold text-una-deep focus:border-una-gold focus:bg-white focus:outline-none"
                    />
                  </div>

                  {/* Is Active Toggle */}
                  <div className="flex items-center gap-3 sm:mt-6 sm:justify-end">
                    <input
                      type="checkbox"
                      id={`active-${idx}`}
                      checked={step.is_active}
                      onChange={(e) => handleChange(idx, "is_active", e.target.checked)}
                      className="size-4 rounded border-stone-300 text-una-gold focus:ring-una-gold"
                    />
                    <label htmlFor={`active-${idx}`} className="text-sm font-bold text-una-deep select-none cursor-pointer">
                      Tampilkan Langkah Ini
                    </label>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Title */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-una-deep">
                      Judul Langkah <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={150}
                      value={step.title}
                      onChange={(e) => handleChange(idx, "title", e.target.value)}
                      placeholder="Contoh: Konsultasi via WhatsApp"
                      className="mt-1.5 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2 text-sm font-bold text-una-deep focus:border-una-gold focus:bg-white focus:outline-none"
                    />
                    {fieldErrors[`steps.${idx}.title`] && (
                      <p className="mt-1 text-xs font-semibold text-rose-500">{fieldErrors[`steps.${idx}.title`]}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-una-deep">
                      Keterangan Detail <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={step.description}
                      onChange={(e) => handleChange(idx, "description", e.target.value)}
                      placeholder="Jelaskan apa yang harus dilakukan pelanggan pada tahap ini..."
                      className="mt-1.5 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-una-deep focus:border-una-gold focus:bg-white focus:outline-none"
                    />
                    {fieldErrors[`steps.${idx}.description`] && (
                      <p className="mt-1 text-xs font-semibold text-rose-500">{fieldErrors[`steps.${idx}.description`]}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="sticky bottom-4 z-20 flex items-center justify-end rounded-xl border border-stone-200 bg-white/95 p-3 shadow-sm backdrop-blur-md">
          <button
            type="submit"
            disabled={isPending || steps.length === 0}
            className="min-h-11 rounded-lg bg-una-gold px-6 py-2.5 text-sm font-black text-una-gold-ink transition-colors hover:bg-una-gold-light disabled:opacity-50"
          >
            {isPending ? "Menyimpan..." : "Simpan perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
