import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import * as authService from "./auth.service";
import { User } from "@/modules/users/user.model";
import { authenticate } from "@/middleware/auth.middleware";
import { validateBody } from "@/middleware/validate";
import { sendSuccess, sendError } from "@/utils/response";
import { REFRESH_TOKEN_MS } from "@/utils/jwt";
import { env } from "@/config/env";

export const authRouter = Router();

// ── Cookie helper ─────────────────────────────────────
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

// ── Schemas ───────────────────────────────────────────
const registerSchema = z.object({
  name:    z.string().min(2,  "Ism kamida 2 ta harf").max(50).trim(),
  surname: z.string().min(2,  "Familiya kamida 2 ta harf").max(50).trim(),
  email:   z.string().email("Yaroqli email kiriting").toLowerCase(),
  password: z
    .string()
    .min(8, "Parol kamida 8 ta belgidan iborat bo'lishi kerak")
    .max(100),
  country: z.string().max(60).optional(),
  lang:    z.enum(["uz", "ru", "en"]).default("uz"),
});

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

// ── POST /api/auth/register ───────────────────────────
authRouter.post(
  "/register",
  validateBody(registerSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto    = req.body as z.infer<typeof registerSchema>;
      const result = await authService.register(dto);

      setRefreshCookie(res, result.tokens.refreshToken);

      sendSuccess(
        res,
        { user: result.user, accessToken: result.tokens.accessToken },
        "Ro'yxatdan o'tdingiz!",
        201
      );
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /api/auth/login ──────────────────────────────
authRouter.post(
  "/login",
  validateBody(loginSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto    = req.body as z.infer<typeof loginSchema>;
      const result = await authService.login(dto);

      setRefreshCookie(res, result.tokens.refreshToken);

      sendSuccess(
        res,
        { user: result.user, accessToken: result.tokens.accessToken },
        "Xush kelibsiz!"
      );
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /api/auth/refresh ────────────────────────────
authRouter.post(
  "/refresh",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token: string | undefined = req.cookies?.refreshToken;
      if (!token) {
        sendError(res, "Refresh token topilmadi", 401);
        return;
      }

      const result = await authService.refresh(token);

      setRefreshCookie(res, result.tokens.refreshToken);
      sendSuccess(res, { accessToken: result.tokens.accessToken });
    } catch (err) {
      next(err);
    }
  }
);

// ── DELETE /api/auth/logout ───────────────────────────
authRouter.delete(
  "/logout",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authService.logout(req.user!.userId);
      clearRefreshCookie(res);
      sendSuccess(res, null, "Chiqib ketdingiz");
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /api/auth/me ──────────────────────────────────
authRouter.get(
  "/me",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.user!.userId)
        .populate("plan")
        .lean();

      if (!user) {
        sendError(res, "Foydalanuvchi topilmadi", 404);
        return;
      }

      sendSuccess(res, user);
    } catch (err) {
      next(err);
    }
  }
);
