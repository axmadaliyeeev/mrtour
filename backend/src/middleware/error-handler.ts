import type { Request, Response, NextFunction } from "express";
import { Error as MongooseError } from "mongoose";
import { MongoServerError } from "mongodb";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { ZodError } from "zod";
import { env } from "@/config/env";

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export function createError(
  message: string,
  statusCode = 500,
  isOperational = true
): AppError {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = isOperational;
  return error;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: AppError | Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const isDev = env.NODE_ENV === "development";

  // ── Log every error ──────────────────────────────────
  console.error(
    `[${new Date().toISOString()}] ${req.method} ${req.path} →`,
    isDev ? err : err.message
  );

  // ── Mongoose: ValidationError ────────────────────────
  if (err instanceof MongooseError.ValidationError) {
    const messages = Object.values(err.errors).map((e) => e.message);
    res.status(422).json({
      success: false,
      message: "Validation failed",
      error: messages.join(", "),
    });
    return;
  }

  // ── Mongoose: CastError (invalid ObjectId) ───────────
  if (err instanceof MongooseError.CastError) {
    res.status(400).json({
      success: false,
      message: `Invalid value for field '${err.path}'`,
      error: isDev ? err.message : undefined,
    });
    return;
  }

  // ── MongoDB: Duplicate key (11000) ───────────────────
  if (err instanceof MongoServerError && err.code === 11000) {
    const field = Object.keys(err.keyValue ?? {})[0] ?? "field";
    res.status(409).json({
      success: false,
      message: `${field} already exists`,
      error: isDev ? err.message : undefined,
    });
    return;
  }

  // ── JWT: expired ─────────────────────────────────────
  if (err instanceof TokenExpiredError) {
    res.status(401).json({
      success: false,
      message: "Token expired. Please log in again.",
    });
    return;
  }

  // ── JWT: invalid ─────────────────────────────────────
  if (err instanceof JsonWebTokenError) {
    res.status(401).json({
      success: false,
      message: "Invalid token.",
    });
    return;
  }

  // ── Zod: validation ──────────────────────────────────
  if (err instanceof ZodError) {
    const details = err.issues.map((i) => ({
      field: i.path.join("."),
      message: i.message,
    }));
    res.status(422).json({
      success: false,
      message: "Validation failed",
      error: isDev ? details : details.map((d) => d.message).join(", "),
    });
    return;
  }

  // ── Operational errors ───────────────────────────────
  const appErr = err as AppError;
  if (appErr.isOperational) {
    res.status(appErr.statusCode ?? 400).json({
      success: false,
      message: err.message,
      ...(isDev && { stack: err.stack }),
    });
    return;
  }

  // ── Unknown / programmer errors ──────────────────────
  res.status(500).json({
    success: false,
    message: "Internal server error",
    ...(isDev && { error: err.message, stack: err.stack }),
  });
}
