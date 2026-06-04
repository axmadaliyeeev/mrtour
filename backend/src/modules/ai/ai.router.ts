import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import * as aiService from "./ai.service";
import { Location } from "@/modules/locations/location.model";
import { Review } from "@/modules/reviews/review.model";
import { optionalAuth, authenticate } from "@/middleware/auth.middleware";
import { validateBody } from "@/middleware/validate";
import { sendSuccess, sendError } from "@/utils/response";

export const aiRouter = Router();

// ── Validation schemas ────────────────────────────────
const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role:    z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      })
    )
    .min(1)
    .max(10),
  userContext: z
    .object({
      name:    z.string().optional(),
      country: z.string().optional(),
      plan:    z.string().optional(),
    })
    .optional(),
});

const analyzeReviewSchema = z.object({
  text:  z.string().min(5).max(1000),
  stars: z.number().int().min(1).max(5),
});

const tourPlanSchema = z.object({
  tourData: z.object({
    days:    z.string().min(1),
    people:  z.string().min(1),
    regions: z.array(z.string()).min(1),
    budget:  z.string().min(1),
  }),
  locationIds: z.array(z.string()).optional(),
});

const insightSchema = z.object({
  locationId: z.string().min(1),
});

// ── POST /api/ai/chat ─────────────────────────────────
aiRouter.post(
  "/chat",
  optionalAuth,
  validateBody(chatSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { messages, userContext } = req.body as z.infer<typeof chatSchema>;

      const reply = await aiService.chat(messages, {
        name:    req.user?.email?.split("@")[0] ?? userContext?.name,
        country: userContext?.country,
        plan:    userContext?.plan,
      });

      sendSuccess(res, { reply });
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /api/ai/analyze-review ───────────────────────
aiRouter.post(
  "/analyze-review",
  optionalAuth,
  validateBody(analyzeReviewSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { text, stars } = req.body as z.infer<typeof analyzeReviewSchema>;
      const result = await aiService.analyzeReview(text, stars);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /api/ai/tour-plan (auth required) ────────────
aiRouter.post(
  "/tour-plan",
  authenticate,
  validateBody(tourPlanSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { tourData, locationIds } = req.body as z.infer<typeof tourPlanSchema>;

      let locations;
      if (locationIds?.length) {
        locations = await Location.find({ _id: { $in: locationIds } }).lean();
      } else {
        const regionRegex = tourData.regions.map((r) => new RegExp(r, "i"));
        locations = await Location.find({
          $or: [
            { region: { $in: regionRegex } },
            { city:   { $in: regionRegex } },
          ],
        })
          .sort({ rating: -1 })
          .limit(15)
          .lean();
      }

      const plan = await aiService.generateTourPlan(tourData, locations);
      sendSuccess(res, { plan });
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /api/ai/analyze-reviews (insight) ────────────
aiRouter.post(
  "/analyze-reviews",
  optionalAuth,
  validateBody(insightSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { locationId } = req.body as z.infer<typeof insightSchema>;

      const location = await Location.findById(locationId).lean();
      if (!location) {
        sendError(res, "Location not found", 404);
        return;
      }

      const reviews = await Review.find({ locationId })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();

      const insight = await aiService.generateInsight(
        location.name,
        reviews.map((r) => ({
          author:     r.author,
          stars:      r.stars,
          text:       r.text,
          trustScore: r.trustScore,
        }))
      );

      sendSuccess(res, { insight });
    } catch (err) {
      next(err);
    }
  }
);
