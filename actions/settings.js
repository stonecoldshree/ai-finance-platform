"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updatePhoneNumber(phoneNumber) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  // Allow clearing the phone number
  const sanitized = phoneNumber?.trim() || null;

  // Basic E.164 format validation if a number is provided
  if (sanitized && !/^\+[1-9]\d{6,14}$/.test(sanitized)) {
    return {
      success: false,
      error: "Please enter a valid phone number in international format (e.g. +919876543210)",
    };
  }

  await db.user.update({
    where: { id: user.id },
    data: { phoneNumber: sanitized },
  });

  revalidatePath("/settings");
  return { success: true };
}

export async function getPhoneNumber() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { phoneNumber: true },
  });

  return user?.phoneNumber || null;
}
