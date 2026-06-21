import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Outfit, Plus_Jakarta_Sans, VT323 } from "next/font/google";
import { Navbar } from "@/src/components/Navbar";
import { Footer } from "@/src/components/Footer";
import { ScrollReveal } from "@/src/components/ScrollReveal";
import { FloatingWhatsApp } from "@/src/components/ui/FloatingWhatsApp";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const vt323 = VT323({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-vt323",
});

export const metadata: Metadata = {
  title: {
    default: "UNA Project",
    template: "%s | UNA Project",
  },
  description:
    "Spesialis jam waktu sholat digital, running text LED, JWS RGB, Android TV, dan instalasi display untuk masjid serta mushola.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${outfit.variable} ${jakarta.variable} ${vt323.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingWhatsApp />
        <ScrollReveal />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
