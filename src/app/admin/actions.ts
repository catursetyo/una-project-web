"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { normalizeApiUrl, parseLoginToken } from "@/src/lib/adminAuth.mjs";
import { ADMIN_SESSION_COOKIE } from "@/src/lib/adminSession";

function loginError(code: string): never {
  redirect(`/admin/login?error=${code}`);
}

export async function login(formData: FormData) {
  const apiUrl = normalizeApiUrl(process.env.API_URL);
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!apiUrl) {
    loginError("configuration");
  }

  if (!email.includes("@") || email.length > 254 || !password || password.length > 128) {
    loginError("invalid");
  }

  let response: Response;

  try {
    response = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
  } catch {
    loginError("unavailable");
  }

  if (!response.ok) {
    if (response.status === 429) {
      loginError("rate-limit");
    }
    loginError([401, 403].includes(response.status) ? "credentials" : "unavailable");
  }

  let token: string | null = null;

  try {
    token = parseLoginToken(await response.json());
  } catch {
    loginError("unavailable");
  }

  if (!token) {
    loginError("unavailable");
  }

  (await cookies()).set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
    priority: "high",
  });

  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/login");
}
