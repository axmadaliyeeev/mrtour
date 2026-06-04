import {
  Schema,
  model,
  type Document,
  type Model,
  type HydratedDocument,
  type Types,
} from "mongoose";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export interface IUser {
  name: string;
  surname: string;
  email: string;
  passwordHash: string;
  country: string;
  lang: string;
  preferences: string[];
  plan: Types.ObjectId[];
  isPremium: boolean;
  refreshToken?: string;
  createdAt: Date;
}

export interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
}

export type UserDocument = HydratedDocument<IUser, IUserMethods>;
export type UserModel = Model<IUser, Record<string, never>, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name:         { type: String, required: true, trim: true },
    surname:      { type: String, required: true, trim: true },
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    country:      { type: String, trim: true, default: "" },
    lang:         { type: String, default: "uz" },
    preferences:  [{ type: String }],
    plan:         [{ type: Schema.Types.ObjectId, ref: "Location" }],
    isPremium:    { type: Boolean, default: false },
    refreshToken: { type: String, select: false },
    createdAt:    { type: Date, default: () => new Date() },
  },
  {
    versionKey: false,
    toJSON: {
      transform(_doc, ret) {
        delete ret.passwordHash;
        delete ret.refreshToken;
        return ret;
      },
    },
  }
);

// ── Pre-save: hash password if modified ───────────────
userSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();

  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});

// ── Instance method: compare password ─────────────────
userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.passwordHash);
};

// ── Index ─────────────────────────────────────────────
userSchema.index({ email: 1 }, { unique: true });

export const User = model<IUser, UserModel>("User", userSchema);
