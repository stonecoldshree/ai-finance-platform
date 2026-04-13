"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { resolveLocale } from "@/lib/i18n/config";

export async function updateUserLocale(locale) {
  try {
    const safeLocale = resolveLocale(locale);
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const updatedUser = await db.user.update({
      where: { clerkUserId: userId },
      data: { locale: safeLocale },
    });

    if (!updatedUser) {
      return { success: false, error: "User not found" };
    }

    // Standard layout invalidation to force Next.js to rerender with new locale config limits
    revalidatePath("/", "layout");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update user locale:", error);
    return { success: false, error: "Failed to update locale in database" };
  }
}
