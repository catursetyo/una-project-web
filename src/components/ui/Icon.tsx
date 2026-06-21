import type { IconName } from "@/src/data/landing";

type IconProps = {
  name: IconName | "arrow" | "menu" | "close" | "star" | "whatsapp";
  className?: string;
};

export function Icon({ name, className = "size-5" }: IconProps) {
  const sharedProps = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true,
  };

  switch (name) {
    case "gps":
      return (
        <svg {...sharedProps}>
          <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "phone":
      return (
        <svg {...sharedProps}>
          <rect x="7" y="2.5" width="10" height="19" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M10.5 17.5h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "shield":
    case "warranty":
      return (
        <svg {...sharedProps}>
          <path d="M12 2.8 19 6v5.2c0 4.5-2.8 8.5-7 10-4.2-1.5-7-5.5-7-10V6l7-3.2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="m8.8 12 2.1 2.1 4.4-4.7" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "install":
      return (
        <svg {...sharedProps}>
          <rect x="3" y="10" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M7 10V7.5a5 5 0 0 1 10 0V10M8 15h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "audio":
      return (
        <svg {...sharedProps}>
          <path d="M6 15V9h3l5-4v14l-5-4H6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M17 9.5a4 4 0 0 1 0 5M19.5 7a7.5 7.5 0 0 1 0 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "panel":
      return (
        <svg {...sharedProps}>
          <rect x="3" y="5" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M8 21h8M12 17v4M7 9h.01M11 9h.01M15 9h.01M7 13h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...sharedProps}>
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "menu":
      return (
        <svg {...sharedProps}>
          <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "close":
      return (
        <svg {...sharedProps}>
          <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "star":
      return (
        <svg {...sharedProps} fill="currentColor">
          <path d="m12 2.8 2.8 5.7 6.2.9-4.5 4.4 1 6.2-5.5-2.9L6.5 20l1-6.2L3 9.4l6.2-.9L12 2.8Z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.85.51 3.58 1.39 5.06L2 22l5.2-1.48a9.86 9.86 0 0 0 4.84 1.27h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm4.5 11.97c-.25-.12-1.45-.71-1.67-.8-.22-.08-.39-.12-.55.13-.16.25-.63.79-.78.95-.14.16-.29.18-.54.06-.25-.12-1.04-.38-1.99-1.22-.74-.65-1.23-1.46-1.38-1.71-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.24-.41.08-.16.04-.31-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.43.06-.65.31-.22.25-.86.84-.86 2.05s.88 2.38 1 2.54c.12.16 1.73 2.64 4.2 3.7.59.25 1.04.4 1.4.51.59.19 1.12.16 1.54.1.47-.07 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.47-.28Z" />
        </svg>
      );
  }
}
