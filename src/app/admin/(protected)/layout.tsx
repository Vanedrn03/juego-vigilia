import Link from "next/link";
import { logoutAction } from "../actions";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-slate-100">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3 text-sm">
          <span className="font-bold text-amber-600">Admin</span>
          <Link className="hover:text-amber-700" href="/admin/dashboard">
            Panel
          </Link>
          <form action={logoutAction} className="ml-auto">
            <button
              type="submit"
              className="rounded border border-slate-300 px-3 py-1 text-slate-700 hover:border-amber-400 hover:text-amber-700"
            >
              Cerrar sesión
            </button>
          </form>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
