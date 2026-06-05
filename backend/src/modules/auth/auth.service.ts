import bcrypt from "bcryptjs";
import { type User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
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
  const exists = await prisma.user.findUnique({
    where: { email: dto.email.toLowerCase() },
  });
  if (exists) throw createError("Bu email allaqachon ro'yxatdan o'tgan", 409);

  const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name:         dto.name.trim(),
      surname:      dto.surname.trim(),
      email:        dto.email.toLowerCase().trim(),
      passwordHash,
      country:      dto.country ?? "",
      lang:         dto.lang ?? "uz",
    },
  });

  const finalTokens = buildTokens(user);
  await prisma.user.update({
    where: { id: user.id },
    data:  { refreshToken: finalTokens.refreshToken },
  });

  return { user: sanitize(user), tokens: finalTokens };
}

// ── login ─────────────────────────────────────────────
export async function login(
  dto: LoginDto
): Promise<{ user: SafeUser; tokens: TokenPair }> {
  const user = await prisma.user.findUnique({
    where: { email: dto.email.toLowerCase() },
  });
  if (!user) throw createError("Email yoki parol noto'g'ri", 401);

  const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
  if (!isMatch) throw createError("Email yoki parol noto'g'ri", 401);

  const tokens = buildTokens(user);

  await prisma.user.update({
    where: { id: user.id },
    data:  { refreshToken: tokens.refreshToken },
  });

  return { user: sanitize(user), tokens };
}

// ── refresh ───────────────────────────────────────────
export async function refresh(
  incomingToken: string
): Promise<{ tokens: TokenPair }> {
  const payload = verifyRefreshToken(incomingToken);
  if (!payload) throw createError("Token yaroqsiz yoki muddati o'tgan", 401);

  const user = await prisma.user.findFirst({
    where: { id: payload.userId, refreshToken: incomingToken },
  });
  if (!user) throw createError("Token topilmadi — iltimos qayta kiring", 401);

  const tokens = buildTokens(user);

  await prisma.user.update({
    where: { id: user.id },
    data:  { refreshToken: tokens.refreshToken },
  });

  return { tokens };
}

// ── logout ────────────────────────────────────────────
export async function logout(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data:  { refreshToken: null },
  });
}
