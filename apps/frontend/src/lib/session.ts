import "server-only";

import { Session, TGetUserDataSelect } from "@repo/shared-types";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { COOKIE_OPTIONS, COOKIES_EXPIRES_AT } from "./constants";
import { kyyAuth } from "./ky";

const secretKey = process.env.APP_KEY!;
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
  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(COOKIES_EXPIRES_AT)
    .sign(encodedKey);

  const cookie = await cookies();
  cookie.set("session", session, COOKIE_OPTIONS);
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

export const getCurrentUser = cache(
  async (): Promise<TGetUserDataSelect | null> => {
    const session = await getSession();
    if (!session || !session.user) return null;

    try {
      const user = await kyyAuth(session)
        .get(`users/${session.user.id}`)
        .json<TGetUserDataSelect>();
      if (!user) return null;

      return user;
    } catch (error) {
      console.error("Failed to get current user" + error);
      return null;
    }
  }
);
