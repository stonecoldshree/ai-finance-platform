import { cache } from "react";
import { auth } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const getAuthUser = cache(async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return user;
});
