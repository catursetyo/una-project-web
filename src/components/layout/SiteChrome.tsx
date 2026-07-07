"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/src/components/layout/Footer";
import { Navbar } from "@/src/components/layout/Navbar";
import { FloatingWhatsApp } from "@/src/components/ui/FloatingWhatsApp";
import { ScrollReveal } from "@/src/components/ui/ScrollReveal";
import { AnalyticsTracker } from "@/src/components/analytics/AnalyticsTracker";

type SiteChromeProps = {
  children: React.ReactNode;
};

export function SiteChrome({ children }: SiteChromeProps) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return children;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingWhatsApp />
      <ScrollReveal />
      <AnalyticsTracker />
    </>
  );
}
