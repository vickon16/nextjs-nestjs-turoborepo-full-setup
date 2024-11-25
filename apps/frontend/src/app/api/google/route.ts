import { createSession } from "@/lib/session";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");
  const userId = Number(searchParams.get("userId"));
  const name = searchParams.get("name");
  const email = searchParams.get("email");
  const role = searchParams.get("role") as Role | null;

  if (!accessToken || !refreshToken || !userId || !name || !email || !role)
    return new Response("Google OAuth Failed", { status: 400 });

  await createSession({
    user: { email, name, id: userId, role },
    accessToken,
    refreshToken,
  });

  redirect("/dashboard");
}
