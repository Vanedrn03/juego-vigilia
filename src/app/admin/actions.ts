"use server";

import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/session";

export async function loginAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const password = formData.get("password");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return { error: "El servidor no tiene configurada ADMIN_PASSWORD." };
  }

  if (typeof password !== "string" || password !== adminPassword) {
    return { error: "Contraseña incorrecta." };
  }

  const session = await getAdminSession();
  session.isAdmin = true;
  await session.save();

  redirect("/admin/dashboard");
}

export async function logoutAction() {
  const session = await getAdminSession();
  session.destroy();
  redirect("/admin/login");
}
