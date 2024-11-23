import { withBearerAuth } from "@/lib/ky";
import { createSession } from "@/lib/session";
import { Session } from "@repo/shared-types";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const response = await req.json();
    const oldToken = (response || "") as string;
    if (!oldToken) return new Response("Unauthorized", { status: 401 });

    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/refresh`,
      {
        headers: {
          ...withBearerAuth(oldToken),
          "Content-Type": "application/json",
        },
      }
    );

    if (!resp.ok) return new Response("Unauthorized", { status: 401 });
    const newSession = (await resp.json()) as Session;
    if (!newSession) return new Response("Unauthorized", { status: 401 });

    await createSession(newSession);

    return Response.json(newSession, {
      status: 200,
    });
  } catch (error) {
    console.log("Internal server error", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
