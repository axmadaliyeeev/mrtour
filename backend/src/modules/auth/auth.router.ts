import { Router, type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { z } from "zod";
import * as authService from "./auth.service";
import { prisma } from "@/lib/prisma";
import { authenticate, type JwtPayload } from "@/middleware/auth.middleware";
import { validateBody } from "@/middleware/validate";
import { sendSuccess, sendError } from "@/utils/response";
import { REFRESH_TOKEN_MS } from "@/utils/jwt";
import { env } from "@/config/env";

// Verifying a Google Identity Services ID token only ever needs the
// Client ID (as the expected `audience`) — the client SECRET is only
// needed for the server-side authorization-code exchange flow, which
// this app doesn't use. The frontend gets an ID token directly from
// Google Identity Services and POSTs it here; this just verifies its
// signature/audience/issuer against Google's public keys.
const googleClient = env.GOOGLE_CLIENT_ID ? new OAuth2Client(env.GOOGLE_CLIENT_ID) : null;

function decodeExpiredToken(token: string): JwtPayload | null {
  try {
    // ignoreExpiration: still verifies the signature, just tolerates an
    // expired `exp` claim — safe because we only use this to look up whose
    // session to clear, never to authorize an action.
    return jwt.verify(token, env.JWT_SECRET, { ignoreExpiration: true }) as JwtPayload;
  } catch {
    return null;
  }
}

export const authRouter = Router();

function setRefreshCookie(res: Response, token: string): void {
  const isProd = env.NODE_ENV === "production";
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure:   isProd,
    // Frontend (Vercel) and backend (Render) live on different domains in
    // production, so the cookie is cross-site — "strict"/"lax" would never
    // be sent on those requests. "none" (requires secure:true) is mandatory
    // here; "lax" is fine for local dev where both run on localhost.
    sameSite: isProd ? "none" : "lax",
    maxAge:   REFRESH_TOKEN_MS,
    path:     "/api/auth",
  });
}

function clearRefreshCookie(res: Response): void {
  const isProd = env.NODE_ENV === "production";
  res.clearCookie("refreshToken", {
    path: "/api/auth",
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });
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

const googleSchema = z.object({
  idToken: z.string().min(1),
  lang:    z.string().max(5).optional(),
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

// ── POST /api/auth/google ──────────────────────────────
authRouter.post(
  "/google",
  validateBody(googleSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!googleClient) {
        sendError(res, "Google sign-in is not configured on this server", 500);
        return;
      }
      const { idToken, lang } = req.body as z.infer<typeof googleSchema>;

      let ticket;
      try {
        ticket = await googleClient.verifyIdToken({
          idToken,
          audience: env.GOOGLE_CLIENT_ID,
        });
      } catch {
        sendError(res, "Google token yaroqsiz", 401);
        return;
      }

      const payload = ticket.getPayload();
      if (!payload?.sub || !payload.email) {
        sendError(res, "Google token yaroqsiz", 401);
        return;
      }
      // Google-side flag for "is this email actually verified" — reject
      // unverified emails rather than silently trusting whatever string
      // came back in the token payload.
      if (payload.email_verified === false) {
        sendError(res, "Google email tasdiqlanmagan", 401);
        return;
      }

      // Google doesn't guarantee given_name/family_name (some accounts
      // only have a mononym or nothing at all) — an empty name would
      // propagate into UI that renders name[0] avatars and greetings, so
      // fall back to the email's local part rather than "".
      const fallbackName = payload.email.split("@")[0] || "Traveler";
      const result = await authService.googleAuth({
        googleId: payload.sub,
        email:    payload.email,
        name:     payload.given_name ?? payload.name ?? fallbackName,
        surname:  payload.family_name ?? "",
        lang,
      });
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

// ── DELETE /api/auth/logout ─────────────────────────────
// Logout must succeed even if the access token already expired — otherwise
// the refresh-token cookie and DB session are never cleared and the
// "logged out" user can still mint new access tokens until it naturally expires.
authRouter.delete(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const auth = req.headers.authorization;
      const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
      const payload = token ? decodeExpiredToken(token) : null;

      if (payload?.userId) {
        await authService.logout(payload.userId);
      }
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
