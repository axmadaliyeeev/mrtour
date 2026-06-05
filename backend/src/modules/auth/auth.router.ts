import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import * as authService from "./auth.service";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/middleware/auth.middleware";
import { validateBody } from "@/middleware/validate";
import { sendSuccess, sendError } from "@/utils/response";
import { REFRESH_TOKEN_MS } from "@/utils/jwt";
import { env } from "@/config/env";

export const authRouter = Router();

function setRefreshCookie(res: Response, token: string): void {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure:   env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge:   REFRESH_TOKEN_MS,
    path:     "/api/auth",
  });
}

function clearRefreshCookie(res: Response): void {
  res.clearCookie("refreshToken", { path: "/api/auth" });
}

const registerSchema = z.object({
  name:     z.string().min(2).max(50).trim(),
  surname:  z.string().min(2).max(50).trim(),
  email:    z.string().email().toLowerCase(),
  password: z.string().min(8).max(100),
  country:  z.string().max(60).optional(),
  lang:     z.string().max(5).default("uz"),
});

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

// ── POST /api/auth/register ────────────────────────────
authRouter.post(
  "/register",
  validateBody(registerSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.register(req.body as z.infer<typeof registerSchema>);
      setRefreshCookie(res, result.tokens.refreshToken);
      sendSuccess(res, { user: result.user, accessToken: result.tokens.accessToken }, "Ro'yxatdan o'tdingiz!", 201);
    } catch (err) { next(err); }
  }
);

// ── POST /api/auth/login ───────────────────────────────
authRouter.post(
  "/login",
  validateBody(loginSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.login(req.body as z.infer<typeof loginSchema>);
      setRefreshCookie(res, result.tokens.refreshToken);
      sendSuccess(res, { user: result.user, accessToken: result.tokens.accessToken }, "Xush kelibsiz!");
    } catch (err) { next(err); }
  }
);

// ── POST /api/auth/refresh ─────────────────────────────
authRouter.post(
  "/refresh",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token: string | undefined = req.cookies?.refreshToken;
      if (!token) { sendError(res, "Refresh token topilmadi", 401); return; }
      const result = await authService.refresh(token);
      setRefreshCookie(res, result.tokens.refreshToken);
      sendSuccess(res, { accessToken: result.tokens.accessToken });
    } catch (err) { next(err); }
  }
);

// ── DELETE /api/auth/logout ────────────────────────────
authRouter.delete(
  "/logout",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authService.logout(req.user!.userId);
      clearRefreshCookie(res);
      sendSuccess(res, null, "Chiqib ketdingiz");
    } catch (err) { next(err); }
  }
);

// ── GET /api/auth/me ───────────────────────────────────
authRouter.get(
  "/me",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.userId },
        include: {
          plan: { include: { location: true }, orderBy: { createdAt: "desc" } },
        },
      });
      if (!user) { sendError(res, "Foydalanuvchi topilmadi", 404); return; }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, refreshToken, ...safe } = user;
      sendSuccess(res, safe);
    } catch (err) { next(err); }
  }
);
