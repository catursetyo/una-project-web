"use client";

import { useEffect, useState } from "react";

const runningText =
  "UNA PROJECT  •  RUNNING TEXT  •  JAM WAKTU SHOLAT DIGITAL  •  CUSTOM SESUAI KEBUTUHAN  •  ";

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function getDisplayTime(date: Date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds(),
  )}`;
}

export function JwsDisplayMockup() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const updateTime = () => setNow(new Date());

    updateTime();
    const timer = window.setInterval(updateTime, 1000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="hero-display-float relative mx-auto w-full">
      <div
        aria-hidden="true"
        className="absolute inset-x-[12%] -bottom-5 h-10 rounded-full bg-black/50 blur-xl"
      />
      <div className="metal-frame relative rounded-xl p-1.5 shadow-[0_24px_48px_-22px_rgb(0_0_0_/_85%)] sm:p-2">
        <div className="relative overflow-hidden rounded-lg bg-[#151412] px-4 pt-6 text-center shadow-inner ring-1 ring-white/10 sm:px-10 sm:pt-9">
          <div className="led-dot-grid absolute inset-0 opacity-70" />

          <time
            dateTime={now?.toISOString()}
            className="relative z-10 block font-led text-[clamp(4rem,17vw,7rem)] leading-none tracking-[0.05em] text-una-led-orange drop-shadow-[0_0_12px_rgb(255_92_51_/_70%)]"
          >
            {now ? getDisplayTime(now) : "--:--:--"}
          </time>

          <div className="relative z-10 mt-5 overflow-hidden border-t border-una-led-orange/20 py-3 sm:mt-7 sm:py-4">
            <p className="sr-only">{runningText}</p>
            <div
              aria-hidden="true"
              className="hero-marquee font-led text-xl tracking-[0.1em] text-una-gold-light sm:text-2xl"
            >
              <span className="shrink-0 pr-10">{runningText}</span>
              <span className="shrink-0 pr-10">{runningText}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
