"use server";

import { db } from "@/lib/prisma";
import { getAuthUser } from "@/lib/cachedAuth";
import { revalidatePath } from "next/cache";

export async function getUserGoals() {
  try {
    const user = await getAuthUser();
    
    // Sort goals logically (in progress first, then achieved)
    const goals = await db.goal.findMany({
      where: { userId: user.id },
      orderBy: [
        { status: "asc" },
        { createdAt: "desc" }
      ]
    });

    // Serialize decimal values
    return goals.map(goal => ({
      ...goal,
      targetAmount: goal.targetAmount.toNumber(),
      currentAmount: goal.currentAmount.toNumber()
    }));
  } catch (error) {
    if (error?.digest === "DYNAMIC_SERVER_USAGE" || error?.message?.includes("Dynamic server usage")) {
      throw error;
    }
    console.error("Error fetching user goals:", error);
    return null;
  }
}

export async function createGoal(data) {
  try {
    const user = await getAuthUser();

    const newGoal = await db.goal.create({
      data: {
        userId: user.id,
        name: data.name,
        targetAmount: data.targetAmount,
        targetDate: data.targetDate ? new Date(data.targetDate) : null,
        color: data.color || "#ea580c",
        icon: data.icon || "target",
      }
    });

    revalidatePath("/goals");
    return { success: true, data: { ...newGoal, targetAmount: newGoal.targetAmount.toNumber(), currentAmount: newGoal.currentAmount.toNumber() } };
  } catch (error) {
    console.error("Error creating goal:", error);
    return { success: false, error: error.message };
  }
}

export async function updateGoalFund(id, amountToAdd) {
  try {
    const user = await getAuthUser();

    // Verify ownership
    const goal = await db.goal.findUnique({
      where: { id }
    });

    if (!goal || goal.userId !== user.id) {
      throw new Error("Goal not found");
    }

    const newAmount = goal.currentAmount.toNumber() + amountToAdd;
    let newStatus = goal.status;
    
    if (newAmount >= goal.targetAmount.toNumber()) {
      newStatus = "ACHIEVED";
    }

    const updatedGoal = await db.goal.update({
      where: { id },
      data: {
        currentAmount: newAmount,
        status: newStatus
      }
    });

    revalidatePath("/goals");
    return { success: true, data: { ...updatedGoal, targetAmount: updatedGoal.targetAmount.toNumber(), currentAmount: updatedGoal.currentAmount.toNumber() } };
  } catch (error) {
    console.error("Error funding goal:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteGoal(id) {
  try {
    const user = await getAuthUser();

    const goal = await db.goal.findUnique({
      where: { id }
    });

    if (!goal || goal.userId !== user.id) {
      throw new Error("Goal not found");
    }

    await db.goal.delete({
      where: { id }
    });

    revalidatePath("/goals");
    return { success: true };
  } catch (error) {
    console.error("Error deleting goal:", error);
    return { success: false, error: error.message };
  }
}
