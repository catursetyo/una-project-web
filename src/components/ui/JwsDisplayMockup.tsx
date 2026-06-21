"use client";

import { useEffect, useState } from "react";

const dayNames = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

const monthNames = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const prayerTimes = [
  { name: "Subuh", time: "04:15" },
  { name: "Dzuhur", time: "11:45" },
  { name: "Ashar", time: "15:05", isNext: true },
  { name: "Maghrib", time: "17:58" },
  { name: "Isya", time: "19:08" },
];

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function getDisplayDate(date: Date) {
  return `${dayNames[date.getDay()]}, ${date.getDate()} ${
    monthNames[date.getMonth()]
  } ${date.getFullYear()}`;
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
    <div className="relative mx-auto w-full min-w-0 max-w-[520px] overflow-hidden">
      <div className="metal-frame rounded-[18px] p-2 shadow-[0_18px_42px_-24px_rgb(0_0_0_/_65%)] sm:p-2.5">
        <div className="relative min-w-0 overflow-hidden rounded-lg bg-[#181210] px-2 pb-0 pt-4 text-center shadow-inner sm:px-5 sm:pt-5">
          <div className="led-dot-grid absolute inset-0 opacity-70" />

          <div className="relative z-10 font-led text-[clamp(2.85rem,16vw,5.7rem)] leading-none text-led-orange">
            {now ? getDisplayTime(now) : "--:--:--"}
          </div>
          <div className="relative z-10 mt-1 font-led text-base uppercase tracking-[0.08em] text-[#d49060] sm:text-xl">
            {now ? getDisplayDate(now) : "Memuat..."}
          </div>

          <div className="relative z-10 mt-4 grid min-w-0 grid-cols-3 gap-1 sm:grid-cols-5">
            {prayerTimes.map((prayer) => (
              <div
                key={prayer.name}
                className={`rounded-md border px-1 py-2 ${
                  prayer.isNext
                    ? "border-una-led-orange/45 bg-una-led-orange/10"
                    : "border-una-led-orange/15 bg-una-led-orange/5"
                }`}
              >
                <span className="block text-[0.48rem] font-bold uppercase tracking-[0.06em] text-[#8a6248] sm:text-[0.5rem]">
                  {prayer.name}
                </span>
                <span
                  className={`mt-0.5 block font-led text-lg leading-none sm:text-xl ${
                    prayer.isNext
                      ? "text-led-orange"
                      : "text-una-gold-light drop-shadow-[0_0_6px_rgb(240_200_117_/_45%)]"
                  }`}
                >
                  {prayer.time}
                </span>
              </div>
            ))}
          </div>

          <div className="relative z-10 mt-4 overflow-hidden border-t border-una-led-orange/20 py-2">
            <div className="animate-marquee whitespace-nowrap font-led text-xl tracking-[0.04em] text-led-orange sm:text-2xl">
              UNA PROJECT - JAM WAKTU SHOLAT DIGITAL - AKURASI GPS - SETTING
              VIA SMARTPHONE - AUTO MUROTAL - HUBUNGI KAMI
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
