"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <ThemeToggle className="fixed right-4 top-4 z-10" />
      <form
        action={formAction}
        className="w-full max-w-sm rounded-lg border border-amber-500/30 bg-slate-100 dark:bg-slate-900 p-8 shadow-xl"
      >
        <h1 className="mb-1 text-center text-xl font-bold text-amber-600 dark:text-amber-400">
          ¿Quién Quiere Ser Bendecido?
        </h1>
        <p className="mb-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Panel de administración · Misión Cristiana Elim
        </p>

        <label className="mb-1 block text-sm text-slate-700 dark:text-slate-300" htmlFor="password">
          Contraseña de administrador
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          className="mb-4 w-full rounded border border-slate-300 dark:border-slate-700 bg-white px-3 py-2 text-slate-900 outline-none focus:border-amber-400 dark:bg-slate-800 dark:text-white"
        />

        {state?.error && (
          <p className="mb-4 text-sm text-red-600 dark:text-red-400">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded bg-amber-500 px-3 py-2 font-semibold text-slate-950 transition hover:bg-amber-400 disabled:opacity-50"
        >
          {pending ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
