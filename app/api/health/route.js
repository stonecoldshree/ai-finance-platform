import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getEnvReadiness, getLaunchConfig } from "@/lib/launch-config";

async function getDatabaseStatus() {
  try {
    await db.$queryRaw`SELECT 1`;
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

export async function GET() {
  const envReadiness = getEnvReadiness();
  const database = await getDatabaseStatus();
  const launchConfig = getLaunchConfig();

  const status = envReadiness.isReady && database.ok ? "healthy" : "degraded";
  const responseStatus = status === "healthy" ? 200 : 503;

  return NextResponse.json(
    {
      status,
      timestamp: new Date().toISOString(),
      checks: {
        database,
        env: envReadiness
      },
      launchConfig
    },
    { status: responseStatus }
  );
}