import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { User } from "./user.model";
import { Location } from "@/modules/locations/location.model";
import { authenticate } from "@/middleware/auth.middleware";
import { validateBody, validateParams } from "@/middleware/validate";
import { sendSuccess, sendError } from "@/utils/response";
import { createError } from "@/middleware/error-handler";

export const userRouter = Router();

// All user routes require auth
userRouter.use(authenticate);

// ── Schemas ───────────────────────────────────────────
const updateMeSchema = z.object({
  name:        z.string().min(2).max(50).trim().optional(),
  surname:     z.string().min(2).max(50).trim().optional(),
  country:     z.string().max(60).optional(),
  lang:        z.enum(["uz", "ru", "en"]).optional(),
  preferences: z.array(z.string()).max(20).optional(),
});

const planBodySchema = z.object({
  locationId: z.string().min(1),
});

const planParamSchema = z.object({
  locationId: z.string().min(1),
});

// ── PATCH /api/users/me ───────────────────────────────
userRouter.patch(
  "/me",
  validateBody(updateMeSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updates = req.body as z.infer<typeof updateMeSchema>;

      const user = await User.findByIdAndUpdate(
        req.user!.userId,
        { $set: updates },
        { new: true, runValidators: true }
      ).populate("plan");

      if (!user) {
        sendError(res, "Foydalanuvchi topilmadi", 404);
        return;
      }

      sendSuccess(res, user, "Profil yangilandi");
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /api/users/me/plan ───────────────────────────
userRouter.post(
  "/me/plan",
  validateBody(planBodySchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { locationId } = req.body as z.infer<typeof planBodySchema>;

      // Verify location exists
      const location = await Location.findById(locationId).lean();
      if (!location) throw createError("Joy topilmadi", 404);

      const user = await User.findByIdAndUpdate(
        req.user!.userId,
        { $addToSet: { plan: locationId } }, // $addToSet prevents duplicates
        { new: true }
      ).populate("plan");

      if (!user) {
        sendError(res, "Foydalanuvchi topilmadi", 404);
        return;
      }

      sendSuccess(res, { plan: user.plan }, "Rejaga qo'shildi", 201);
    } catch (err) {
      next(err);
    }
  }
);

// ── DELETE /api/users/me/plan/:locationId ─────────────
userRouter.delete(
  "/me/plan/:locationId",
  validateParams(planParamSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { locationId } = req.params;

      const user = await User.findByIdAndUpdate(
        req.user!.userId,
        { $pull: { plan: locationId } },
        { new: true }
      ).populate("plan");

      if (!user) {
        sendError(res, "Foydalanuvchi topilmadi", 404);
        return;
      }

      sendSuccess(res, { plan: user.plan }, "Rejadan o'chirildi");
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /api/users/me/plan ────────────────────────────
userRouter.get(
  "/me/plan",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.user!.userId)
        .populate("plan")
        .lean();

      if (!user) {
        sendError(res, "Foydalanuvchi topilmadi", 404);
        return;
      }

      sendSuccess(res, { plan: user.plan ?? [] });
    } catch (err) {
      next(err);
    }
  }
);
