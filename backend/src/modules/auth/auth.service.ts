import bcrypt from "bcryptjs";
import { type User } from "@prisma/client";
import { prisma, withRetry } from "@/lib/prisma";
import { generateTokens, verifyRefreshToken, type TokenPair } from "@/utils/jwt";
import { createError } from "@/middleware/error-handler";

const SALT_ROUNDS = 12;

export interface RegisterDto {
  name:     string;
  surname:  string;
  email:    string;
  password: string;
  country?: string;
  lang?:    string;
}

export interface LoginDto {
  email:    string;
  password: string;
}

type SafeUser = Omit<User, "passwordHash" | "refreshToken">;

// ── Helpers ───────────────────────────────────────────
function sanitize(user: User): SafeUser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, refreshToken, ...safe } = user;
  return safe;
}

function buildTokens(user: User): TokenPair {
  return generateTokens({
    userId:    user.id,
    email:     user.email,
    isPremium: user.isPremium,
  });
}

// ── register ──────────────────────────────────────────
export async function register(
  dto: RegisterDto
): Promise<{ user: SafeUser; tokens: TokenPair }> {
  const exists = await withRetry(() =>
    prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } })
  );
  if (exists) throw createError("Bu email allaqachon ro'yxatdan o'tgan", 409);

  const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

  const user = await withRetry(() =>
    prisma.user.create({
      data: {
        name:         dto.name.trim(),
        surname:      dto.surname.trim(),
        email:        dto.email.toLowerCase().trim(),
        passwordHash,
        country:      dto.country ?? "",
        lang:         dto.lang ?? "uz",
      },
    })
  );

  const finalTokens = buildTokens(user);
  await withRetry(() =>
    prisma.user.update({
      where: { id: user.id },
      data:  { refreshToken: finalTokens.refreshToken },
    })
  );

  return { user: sanitize(user), tokens: finalTokens };
}

// ── login ─────────────────────────────────────────────
export async function login(
  dto: LoginDto
): Promise<{ user: SafeUser; tokens: TokenPair }> {
  const user = await withRetry(() =>
    prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } })
  );
  if (!user) throw createError("Email yoki parol noto'g'ri", 401);

  // A Google-only account has no passwordHash — reject the email/password
  // attempt with the same generic message as a wrong password, rather
  // than a bcrypt.compare(x, null) crash or a message that reveals the
  // account exists and is Google-only (that's an account-enumeration leak).
  if (!user.passwordHash) throw createError("Email yoki parol noto'g'ri", 401);

  const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
  if (!isMatch) throw createError("Email yoki parol noto'g'ri", 401);

  const tokens = buildTokens(user);

  await withRetry(() =>
    prisma.user.update({
      where: { id: user.id },
      data:  { refreshToken: tokens.refreshToken },
    })
  );

  return { user: sanitize(user), tokens };
}

// ── refresh ───────────────────────────────────────────
export async function refresh(
  incomingToken: string
): Promise<{ tokens: TokenPair }> {
  const payload = verifyRefreshToken(incomingToken);
  if (!payload) throw createError("Token yaroqsiz yoki muddati o'tgan", 401);

  const user = await withRetry(() =>
    prisma.user.findFirst({
      where: { id: payload.userId, refreshToken: incomingToken },
    })
  );
  if (!user) throw createError("Token topilmadi — iltimos qayta kiring", 401);

  const tokens = buildTokens(user);

  await withRetry(() =>
    prisma.user.update({
      where: { id: user.id },
      data:  { refreshToken: tokens.refreshToken },
    })
  );

  return { tokens };
}

export interface GoogleProfile {
  googleId: string;
  email:    string;
  name:     string;
  surname:  string;
  // Interface language the visitor was already using when they signed
  // in. Without this, a newly-created Google account fell back to the
  // Prisma column default ("uz") — and since the frontend store adopts
  // user.lang on login, signing in with Google silently switched an
  // English/Russian visitor's whole interface to Uzbek.
  lang?:    string;
}

// ── googleAuth ───────────────────────────────────────
// Called after the router has already verified the Google ID token —
// this only handles the find-or-create + token-issuing side, the same
// shape as register()/login() so the router can treat all three
// identically (set cookie, send { user, accessToken }).
export async function googleAuth(
  profile: GoogleProfile
): Promise<{ user: SafeUser; tokens: TokenPair }> {
  const email = profile.email.toLowerCase();

  let user = await withRetry(() => prisma.user.findUnique({ where: { email } }));

  if (user) {
    // An account already exists with this email (created via email/
    // password, or a previous Google sign-in). Link the Google ID if it
    // isn't set yet, so this same Google account can sign back in next
    // time without a duplicate-email conflict.
    if (!user.googleId) {
      user = await withRetry(() =>
        prisma.user.update({ where: { id: user!.id }, data: { googleId: profile.googleId } })
      );
    }
  } else {
    user = await withRetry(() =>
      prisma.user.create({
        data: {
          name:     profile.name,
          surname:  profile.surname,
          email,
          googleId: profile.googleId,
          ...(profile.lang && { lang: profile.lang }),
          // passwordHash intentionally omitted — null for a Google-only
          // account. See the schema comment on User.passwordHash.
        },
      })
    );
  }

  const tokens = buildTokens(user);
  await withRetry(() =>
    prisma.user.update({ where: { id: user!.id }, data: { refreshToken: tokens.refreshToken } })
  );

  return { user: sanitize(user), tokens };
}

// ── logout ────────────────────────────────────────────
export async function logout(userId: string): Promise<void> {
  await withRetry(() =>
    prisma.user.update({
      where: { id: userId },
      data:  { refreshToken: null },
    })
  );
}
