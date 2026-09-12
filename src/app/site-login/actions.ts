"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SITE_AUTH_COOKIE, getExpectedToken, sha256 } from "@/lib/site-auth";

export type SiteLoginState = {
  error?: string;
};

export async function verifySitePassword(
  _prevState: SiteLoginState,
  formData: FormData,
): Promise<SiteLoginState> {
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirect") ?? "/");

  const expected = await getExpectedToken();
  if (!expected) {
    redirect(redirectTo);
  }

  const enteredToken = await sha256(password);
  if (enteredToken !== expected) {
    return { error: "パスワードが正しくありません。" };
  }

  const cookieStore = await cookies();
  cookieStore.set(SITE_AUTH_COOKIE, expected, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  redirect(redirectTo || "/");
}
