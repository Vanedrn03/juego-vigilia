import Link from "next/link";

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="mb-4 inline-flex items-center gap-1 text-sm text-slate-400 hover:text-amber-300"
    >
      ← {label}
    </Link>
  );
}
