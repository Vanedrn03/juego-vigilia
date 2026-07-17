import Link from "next/link";
import { logoutAction } from "../actions";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3 text-sm">
          <span className="font-bold text-amber-600 dark:text-amber-400">Admin</span>
          <Link className="hover:text-amber-700 dark:hover:text-amber-300" href="/admin/dashboard">
            Panel
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded border border-slate-300 dark:border-slate-700 px-3 py-1 text-slate-700 dark:text-slate-300 hover:border-amber-400 hover:text-amber-700 dark:hover:text-amber-300"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
