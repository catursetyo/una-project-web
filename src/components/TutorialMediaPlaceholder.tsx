import type { Tutorial } from "@/src/types/tutorial";

type TutorialMediaPlaceholderProps = {
  tutorial: Tutorial;
};

export function TutorialMediaPlaceholder({
  tutorial,
}: TutorialMediaPlaceholderProps) {
  return (
    <div className="relative mt-6 overflow-hidden rounded-xl border border-primary/15 bg-background">
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-60">
        {Array.from({ length: 24 }).map((_, index) => (
          <span key={index} className="border border-white/70" />
        ))}
      </div>

      <div className="relative flex aspect-video flex-col justify-between p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-primary">
              Video Tutorial
            </p>
            <p className="mt-1 text-sm font-bold text-zinc-600">
              Placeholder video panduan
            </p>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-primary shadow-sm">
            16:9
          </span>
        </div>

        <div>
          <p className="max-w-sm text-xl font-black leading-tight text-zinc-950 sm:text-2xl">
            {tutorial.title}
          </p>
          {tutorial.videoUrl ? (
            <a
              href={tutorial.videoUrl}
              target="_blank"
              rel="noreferrer"
              className="motion-button mt-4 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-black tracking-[0.08em] text-white shadow-lg shadow-primary/20 hover:bg-tertiary"
            >
              Tonton Video
            </a>
          ) : (
            <span className="mt-4 inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-black tracking-[0.08em] text-zinc-500">
              Video belum tersedia
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
