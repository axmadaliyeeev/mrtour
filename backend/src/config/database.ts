import { prisma } from "@/lib/prisma";

export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    console.log("✅  PostgreSQL (Neon) connected via Prisma");
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("❌  Database connection failed:", msg);
    process.exit(1);
  }

  process.on("SIGINT",  () => gracefulShutdown("SIGINT"));
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
}

async function gracefulShutdown(signal: string): Promise<void> {
  console.log(`\n🔔  ${signal} received — closing Prisma connection...`);
  await prisma.$disconnect();
  console.log("✅  Prisma disconnected.");
  process.exit(0);
}
