/* eslint-disable @next/next/no-img-element */
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
    <img
      src="/brand/logo.svg"
      alt=""
      aria-hidden="true"
      draggable="false"
      className={`shrink-0 ${sizeClassNames[size]} ${className}`}
    />
  );
}
