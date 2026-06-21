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
    <div className="relative mx-auto w-full max-w-[520px]">
      <span className="absolute -top-3 right-5 z-10 rounded-full bg-una-led-orange px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.1em] text-white shadow-[0_0_18px_rgb(255_92_51_/_38%)]">
        Live demo
      </span>
      <div className="metal-frame rounded-[18px] p-2.5 shadow-[0_18px_42px_-24px_rgb(0_0_0_/_65%)]">
        <div className="relative overflow-hidden rounded-lg bg-[#181210] px-3 pb-0 pt-5 text-center shadow-inner sm:px-5">
          <div className="led-dot-grid absolute inset-0 opacity-70" />
          <div className="relative z-10 flex items-center justify-between gap-3 text-[0.58rem] uppercase tracking-[0.16em] text-[#8a6248]">
            <span>UNA Project · JWS Display</span>
            <span className="inline-flex items-center gap-1.5 text-[#74d68d]">
              <span className="size-1.5 rounded-full bg-[#4dd980] shadow-[0_0_8px_#4dd980]" />
              GPS synced
            </span>
          </div>

          <div className="relative z-10 mt-3 font-led text-[clamp(3.5rem,14vw,5.7rem)] leading-none text-led-orange">
            {now ? getDisplayTime(now) : "--:--:--"}
          </div>
          <div className="relative z-10 mt-1 font-led text-xl uppercase tracking-[0.08em] text-[#d49060]">
            {now ? getDisplayDate(now) : "Memuat..."}
          </div>
          <div className="relative z-10 mt-2 text-[0.56rem] font-bold uppercase tracking-[0.1em] text-[#72513e]">
            Tampilan contoh produk
          </div>

          <div className="relative z-10 mt-4 grid grid-cols-5 gap-1">
            {prayerTimes.map((prayer) => (
              <div
                key={prayer.name}
                className={`rounded-md border px-1 py-2 ${
                  prayer.isNext
                    ? "border-una-led-orange/45 bg-una-led-orange/10"
                    : "border-una-led-orange/15 bg-una-led-orange/5"
                }`}
              >
                <span className="block text-[0.5rem] font-bold uppercase tracking-[0.08em] text-[#8a6248]">
                  {prayer.name}
                </span>
                <span
                  className={`mt-0.5 block font-led text-xl leading-none ${
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
            <div className="animate-marquee whitespace-nowrap font-led text-2xl tracking-[0.04em] text-led-orange">
              UNA PROJECT - JAM WAKTU SHOLAT DIGITAL - AKURASI GPS - SETTING
              VIA SMARTPHONE - AUTO MUROTAL - HUBUNGI KAMI
            </div>
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-xs leading-5 text-white/45">
        Simulasi tampilan layar JWS Digital, jam mengikuti waktu perangkat.
      </p>
    </div>
  );
}
