import Link from "next/link";
import { logoutAction } from "../actions";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900">
        <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-4 px-4 py-3 text-sm">
          <span className="font-bold text-amber-400">Admin</span>
          <Link className="hover:text-amber-300" href="/admin/dashboard">
            Panel
          </Link>
          <Link className="hover:text-amber-300" href="/admin/preguntas">
            Preguntas
          </Link>
          <Link className="hover:text-amber-300" href="/admin/escalera">
            Escalera de premios
          </Link>
          <Link className="hover:text-amber-300" href="/admin/sesiones/nueva">
            Nueva partida
          </Link>
          <form action={logoutAction} className="ml-auto">
            <button
              type="submit"
              className="rounded border border-slate-700 px-3 py-1 text-slate-300 hover:border-amber-400 hover:text-amber-300"
            >
              Cerrar sesión
            </button>
          </form>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
