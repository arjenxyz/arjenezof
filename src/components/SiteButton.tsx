import Link from "next/link";

type LinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

export function SiteButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: LinkProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition touch-manipulation";
  const styles =
    variant === "primary"
      ? "bg-brand text-white hover:bg-brand-hover"
      : "border border-stone-300 text-stone-700 hover:bg-white";

  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </Link>
  );
}
