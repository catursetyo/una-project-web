"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type AnalyticsEventType = "website_view" | "product_view" | "whatsapp_cta_click";

function productSlugFromPath(pathname: string) {
  const match = pathname.match(/^\/products\/([^/]+)/);
  return match ? decodeURIComponent(match[1]) : undefined;
}

function track(eventType: AnalyticsEventType, pathname: string) {
  const body = JSON.stringify({
    event_type: eventType,
    product_slug: productSlugFromPath(pathname),
    source_path: pathname,
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics", new Blob([body], { type: "application/json" }));
    return;
  }

  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  });
}

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    track("website_view", pathname);
    if (productSlugFromPath(pathname)) {
      track("product_view", pathname);
    }
  }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target : null;
      const link = target?.closest('a[href*="wa.me/"]');
      if (link) track("whatsapp_cta_click", pathname);
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname]);

  return null;
}
