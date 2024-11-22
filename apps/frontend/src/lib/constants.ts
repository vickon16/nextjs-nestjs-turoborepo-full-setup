export const COOKIES_EXPIRES_AT = new Date(
  Date.now() + 7 * 24 * 60 * 60 * 1000
); // 7 days

export const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
  expires: COOKIES_EXPIRES_AT,
  sameSite: "lax" as const,
  path: "/",
};

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/api";
