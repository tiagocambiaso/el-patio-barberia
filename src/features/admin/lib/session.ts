import crypto from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "admin_session";

function computeSessionToken(pin: string): string {
  return crypto
    .createHmac("sha256", pin)
    .update("el-patio-barberia-admin-v1")
    .digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function verifyAdminPinValue(inputPin: string): {
  ok: boolean;
  configured: boolean;
  token?: string;
} {
  const expectedPin = process.env.ADMIN_PIN?.trim();
  if (!expectedPin) {
    return { ok: false, configured: false };
  }

  if (!safeEqual(inputPin.trim(), expectedPin)) {
    return { ok: false, configured: true };
  }

  return {
    ok: true,
    configured: true,
    token: computeSessionToken(expectedPin),
  };
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const expectedPin = process.env.ADMIN_PIN?.trim();
  if (!expectedPin) return false;

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!sessionCookie) return false;

  const expectedToken = computeSessionToken(expectedPin);
  return safeEqual(sessionCookie, expectedToken);
}
