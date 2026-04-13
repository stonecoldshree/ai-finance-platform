"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function normalizePhoneNumber(phoneNumber) {
  if (!phoneNumber || typeof phoneNumber !== "string") {
    return null;
  }

  const compact = phoneNumber.replace(/[\s()-]/g, "").trim();
  if (!compact) {
    return null;
  }

  const defaultCountryCode = process.env.DEFAULT_PHONE_COUNTRY_CODE || "+91";

  if (/^\d{10}$/.test(compact)) {
    return `${defaultCountryCode}${compact}`;
  }

  if (/^0\d{10}$/.test(compact)) {
    return `${defaultCountryCode}${compact.slice(1)}`;
  }

  if (compact.startsWith("00")) {
    return `+${compact.slice(2)}`;
  }

  return compact;
}

export async function updatePhoneNumber(phoneNumber) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId }
  });

  if (!user) throw new Error("User not found");


  const sanitized = normalizePhoneNumber(phoneNumber);


  if (sanitized && !/^\+[1-9]\d{6,14}$/.test(sanitized)) {
    return {
      success: false,
      error: "Please enter a valid phone number in international format (e.g. +919876543210)"
    };
  }

  await db.user.update({
    where: { id: user.id },
    data: { phoneNumber: sanitized }
  });

  revalidatePath("/settings");
  return { success: true };
}

export async function getPhoneNumber() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { phoneNumber: true }
  });

  return user?.phoneNumber || null;
}
