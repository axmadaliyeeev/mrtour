import { User, type UserDocument } from "@/modules/users/user.model";
import { generateTokens, verifyRefreshToken, type TokenPair } from "@/utils/jwt";
import { createError } from "@/middleware/error-handler";

// ── DTOs ──────────────────────────────────────────────
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

// ── Helpers ───────────────────────────────────────────
function buildTokens(user: UserDocument): TokenPair {
  return generateTokens({
    userId:    user._id.toString(),
    email:     user.email,
    isPremium: user.isPremium,
  });
}

// Remove sensitive fields before sending to client
function sanitize(user: UserDocument): Record<string, unknown> {
  const obj = user.toObject() as Record<string, unknown>;
  delete obj.passwordHash;
  delete obj.refreshToken;
  return obj;
}

// ── register ──────────────────────────────────────────
export async function register(
  dto: RegisterDto
): Promise<{ user: Record<string, unknown>; tokens: TokenPair }> {
  const exists = await User.findOne({ email: dto.email.toLowerCase() });
  if (exists) throw createError("Bu email allaqachon ro'yxatdan o'tgan", 409);

  const user = await User.create({
    name:         dto.name.trim(),
    surname:      dto.surname.trim(),
    email:        dto.email.toLowerCase().trim(),
    passwordHash: dto.password, // pre-save hook will hash it
    country:      dto.country ?? "",
    lang:         dto.lang ?? "uz",
  });

  const tokens = buildTokens(user);

  user.refreshToken = tokens.refreshToken;
  await user.save();

  return { user: sanitize(user), tokens };
}

// ── login ─────────────────────────────────────────────
export async function login(
  dto: LoginDto
): Promise<{ user: Record<string, unknown>; tokens: TokenPair }> {
  const user = await User.findOne({ email: dto.email.toLowerCase() }).select(
    "+passwordHash +refreshToken"
  );

  if (!user) throw createError("Email yoki parol noto'g'ri", 401);

  const isMatch = await user.comparePassword(dto.password);
  if (!isMatch) throw createError("Email yoki parol noto'g'ri", 401);

  const tokens = buildTokens(user);

  user.refreshToken = tokens.refreshToken;
  await user.save();

  return { user: sanitize(user), tokens };
}

// ── refresh ───────────────────────────────────────────
export async function refresh(
  incomingToken: string
): Promise<{ tokens: TokenPair }> {
  const payload = verifyRefreshToken(incomingToken);
  if (!payload) throw createError("Token yaroqsiz yoki muddati o'tgan", 401);

  const user = await User.findOne({
    _id:          payload.userId,
    refreshToken: incomingToken,
  }).select("+refreshToken");

  if (!user) throw createError("Token topilmadi — iltimos qayta kiring", 401);

  const tokens = buildTokens(user);

  user.refreshToken = tokens.refreshToken;
  await user.save();

  return { tokens };
}

// ── logout ────────────────────────────────────────────
export async function logout(userId: string): Promise<void> {
  await User.findByIdAndUpdate(userId, {
    $unset: { refreshToken: "" },
  });
}
