import { cache } from "react";
import { auth } from "@clerk/nextjs/server";
import { db } from "./prisma";

/**
 * Request-scoped cached auth + user lookup for server actions.
 * When multiple server actions run in the same request (e.g., getUserAccounts
 * and getDashboardData during dashboard page render), the auth() call and
 * db.user.findUnique() only execute once.
 */
export const getAuthUser = cache(async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return user;
});
