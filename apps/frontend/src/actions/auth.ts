"use server";

import { kyy } from "@/lib/ky";
import { createSession, deleteSession } from "@/lib/session";
import { ActionResponse } from "@/lib/types";
import { handleError } from "@/lib/utils";
import { Session, TLoginSchema, TRegisterSchema } from "@repo/shared-types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function registerAction(
  payload: TRegisterSchema
): Promise<ActionResponse> {
  try {
    const sessionData = await kyy
      .post("auth/register", { json: payload })
      .json<Session>();

    await createSession(sessionData);
    return { success: true, data: sessionData };
  } catch (error) {
    const message = await handleError(error, false);
    return { success: false, error: message };
  }
}

export async function loginAction(
  payload: TLoginSchema
): Promise<ActionResponse> {
  try {
    const sessionData = await kyy
      .post("auth/login", { json: payload })
      .json<Session>();

    await createSession(sessionData);
    return { success: true, data: sessionData };
  } catch (error) {
    const message = await handleError(error, false);
    return { success: false, error: message };
  }
}

export async function deleteAction() {
  await deleteSession();
  revalidatePath("/");
  redirect("/auth/login");
}

export async function createSessionAction(session: Session) {
  return await createSession(session);
}
