"use server";

import { getDb, saveProfile, addSession } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getDbInternal() {
  return await getDb();
}

export async function saveProfileInternal(profile: any) {
  const result = await saveProfile(profile);
  revalidatePath("/");
  return result;
}

export async function addSessionInternal(session: any) {
  const result = await addSession(session);
  revalidatePath("/");
  return result;
}

export async function deleteSessionInternal(id: string) {
  const result = await (await import("@/lib/db")).deleteSession(id);
  revalidatePath("/");
  return result;
}
