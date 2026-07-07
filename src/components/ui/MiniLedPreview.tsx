export type MiniLedPreviewKind = "rgb-time" | "single-time" | "tv" | "key";

type MiniLedPreviewProps = {
  kind: MiniLedPreviewKind;
  tag: string;
  value?: string;
};

export function MiniLedPreview({
  kind,
  tag,
  value = "12:45",
}: MiniLedPreviewProps) {
  return (
    <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden rounded-t-lg bg-una-deep transition-transform duration-200 ease-out group-active:scale-[0.97]">
      <div className="led-dot-grid absolute inset-0 opacity-70" />
      <span className="absolute left-3 top-3 rounded-full border border-una-gold/30 bg-white/10 px-2.5 py-1 text-[0.58rem] font-black uppercase tracking-[0.1em] text-una-gold-light">
        {tag}
      </span>

      {kind === "rgb-time" ? (
        <div className="relative z-10 font-led text-5xl tracking-[0.04em] sm:text-6xl">
          <span className="text-una-led-pink drop-shadow-[0_0_8px_rgb(255_92_138_/_70%)]">
            {value.slice(0, 2)}
          </span>
          <span className="text-una-gold-light drop-shadow-[0_0_8px_rgb(240_200_117_/_60%)]">
            :
          </span>
          <span className="text-una-led-green drop-shadow-[0_0_8px_rgb(92_255_176_/_65%)]">
            {value.slice(3, 5)}
          </span>
        </div>
      ) : null}

      {kind === "single-time" ? (
        <div className="relative z-10 font-led text-5xl tracking-[0.04em] text-led-orange sm:text-6xl">
          {value}
        </div>
      ) : null}

      {kind === "tv" ? (
        <div className="relative z-10 grid size-20 place-items-center rounded-lg border-[3px] border-white/25 bg-[#0e1c18] text-una-gold-light shadow-[0_0_18px_rgb(240_200_117_/_18%)]">
          <span className="font-led text-3xl leading-none">TV</span>
        </div>
      ) : null}

      {kind === "key" ? (
        <div className="relative z-10 font-led text-6xl tracking-[0.08em] text-una-gold-light drop-shadow-[0_0_10px_rgb(240_200_117_/_55%)]">
          KEY
        </div>
      ) : null}
    </div>
  );
}
