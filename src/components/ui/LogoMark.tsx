type LogoMarkProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeClassNames: Record<NonNullable<LogoMarkProps["size"]>, string> = {
  sm: "size-9",
  md: "size-10",
  lg: "size-12",
};

export function LogoMark({ className = "", size = "md" }: LogoMarkProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      fill="none"
      className={`shrink-0 ${sizeClassNames[size]} ${className}`}
    >
      <path
        d="M24 4C16 11 12 18 12 26c0 8.8 5.4 15 12 15s12-6.2 12-15c0-8-4-15-12-22Z"
        fill="#0F3A32"
        stroke="#F0C875"
        strokeWidth="1.6"
      />
      <circle cx="18" cy="22" r="1.5" fill="#F0C875" />
      <circle cx="24" cy="22" r="1.5" fill="#F0C875" />
      <circle cx="30" cy="22" r="1.5" fill="#F0C875" />
      <circle cx="18" cy="27" r="1.5" fill="#F0C875" />
      <circle cx="24" cy="27" r="1.5" fill="#F0C875" />
      <circle cx="30" cy="27" r="1.5" fill="#F0C875" />
      <rect x="21" y="33" width="6" height="6" rx="1.5" fill="#F0C875" />
    </svg>
  );
}
