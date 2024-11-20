import "server-only";

import { Session, TGetUserDataSelect } from "@repo/shared-types";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { kyAuth } from "./ky";

const secretKey = process.env.SESSION_SECRET_KEY!;
const encodedKey = new TextEncoder().encode(secretKey);

export const verifyJWTSession = async (session: string) => {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });

    return payload as Session;
  } catch (error) {
    console.error("Failed to verify session:", error);
    return null;
  }
};

export async function createSession(payload: Session) {
  const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiredAt)
    .sign(encodedKey);

  const cookie = await cookies();
  cookie.set("session", session, {
    secure: true,
    httpOnly: true,
    expires: expiredAt,
    sameSite: "lax",
    path: "/",
  });
}

export const getSession = async () => {
  const cookie = await cookies();
  const oldSession = cookie.get("session")?.value;
  if (!oldSession) return null;
  const newSession = await verifyJWTSession(oldSession);
  return newSession;
};

export const getValidSession = async () => {
  const session = await getSession();
  if (!session || !session.user) return redirect("/auth/login");

  return session;
};

export async function deleteSession() {
  const cookie = await cookies();
  cookie.delete("session");
}

export const getCurrentUser = cache(async () => {
  const session = await getSession();
  if (!session || !session.user) return null;

  console.log({ accessToken: session.accessToken });

  try {
    const user = await kyAuth(session).get(`users/${session.user.id}`).json();
    if (!user) return null;
    return { user, session };
  } catch (error) {
    console.error("Failed to get current user" + error);
    return null;
  }
});
