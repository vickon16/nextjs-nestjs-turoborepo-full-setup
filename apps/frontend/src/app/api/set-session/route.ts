import { createSession } from "@/lib/session";
import { Session } from "@repo/shared-types";

export async function POST(request: Request) {
  const payload = await request.json();
  if (!payload) return new Response("Provide Tokens", { status: 400 });

  const session = payload as Session;

  await createSession(session);
  return new Response("OK", { status: 200 });
}
