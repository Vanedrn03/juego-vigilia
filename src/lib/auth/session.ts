import { getIronSession, type IronSession } from "iron-session";
import { cookies } from "next/headers";

export interface AdminSessionData {
  isAdmin: boolean;
}

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret || sessionSecret.length < 32) {
  throw new Error(
    "SESSION_SECRET debe estar definido en .env y tener al menos 32 caracteres"
  );
}

export const sessionOptions = {
  password: sessionSecret,
  cookieName: "vigilia_admin_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
  },
};

export async function getAdminSession(): Promise<IronSession<AdminSessionData>> {
  const cookieStore = await cookies();
  return getIronSession<AdminSessionData>(cookieStore, sessionOptions);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const session = await getAdminSession();
  return session.isAdmin === true;
}
