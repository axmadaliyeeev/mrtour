import mongoose from "mongoose";
import { env } from "./env";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 3000;

async function connectWithRetry(attempt = 1): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
    });
    console.log(`✅  MongoDB connected [${mongoose.connection.host}]`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌  MongoDB connection failed (attempt ${attempt}/${MAX_RETRIES}): ${message}`);

    if (attempt < MAX_RETRIES) {
      console.log(`⏳  Retrying in ${RETRY_DELAY_MS / 1000}s...`);
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
      return connectWithRetry(attempt + 1);
    }

    console.error("💀  All connection attempts exhausted. Exiting.");
    process.exit(1);
  }
}

export async function connectDatabase(): Promise<void> {
  mongoose.connection.on("disconnected", () =>
    console.warn("⚠️   MongoDB disconnected")
  );
  mongoose.connection.on("reconnected", () =>
    console.log("♻️   MongoDB reconnected")
  );
  mongoose.connection.on("error", (err) =>
    console.error("🔴  MongoDB error:", err.message)
  );

  await connectWithRetry();
}

async function gracefulShutdown(signal: string): Promise<void> {
  console.log(`\n🔔  ${signal} received — closing MongoDB connection...`);
  await mongoose.connection.close();
  console.log("✅  MongoDB connection closed.");
  process.exit(0);
}

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
