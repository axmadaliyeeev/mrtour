import Anthropic from "@anthropic-ai/sdk";
import { env } from "@/config/env";
import type { Location } from "@prisma/client";

const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

export interface ChatMessage  { role: "user" | "assistant"; content: string; }
export interface UserContext  { name?: string; country?: string; plan?: string; }
export interface TourData     { days: string; people: string; regions: string[]; budget: string; }
export interface ReviewForInsight { author: string; stars: number; text: string; trustScore: number; }
export interface AnalysisResult   { trustScore: number; aiTags: string[]; verified: boolean; }

function extractText(response: Anthropic.Message): string {
  for (const block of response.content) {
    if (block.type === "text") return block.text;
  }
  return "";
}

// ── 1. chat ────────────────────────────────────────────
export async function chat(messages: ChatMessage[], ctx: UserContext = {}): Promise<string> {
  const system = `Sen MrTour.uz AI yordamchisi Bek san.
O'zbekiston turizmi bo'yicha mutaxassis.
Foydalanuvchi: ${ctx.name ?? "Mehmon"}, ${ctx.country ?? "noma'lum mamlakat"}.
Rejalashtirilgan joylar: ${ctx.plan ?? "hali yo'q"}.
QOIDALAR:
- Faqat O'zbekiston turizmi haqida javob ber
- Savol tilida (uz/ru/en) javob ber
- Tur reja so'ralsa: avval 4 savol ber, keyin kun-kun jadval tuz
- Narxlarni so'm va USD da ko'rsat (1 USD = 12800 so'm)
- Maksimal 200 so'z, emoji ishlatib yoqimli qil`;

  const response = await client.messages.create({
    model:      "claude-sonnet-4-6",
    max_tokens: 800,
    system,
    messages:   messages.slice(-10),
  });
  return extractText(response);
}

// ── 2. analyzeReview ───────────────────────────────────
export async function analyzeReview(text: string, stars: number): Promise<AnalysisResult> {
  const response = await client.messages.create({
    model:      "claude-haiku-4-5-20251001",
    max_tokens: 200,
    system: `Return ONLY valid JSON, no markdown:
{"trustScore":number,"aiTags":string[]}
trustScore: 70-100=genuine detail, 40-69=generic/short, 0-39=spam/bot
aiTags: 2-4 uzbek topic keywords`,
    messages: [{ role: "user", content: `Review (${stars} stars): "${text}"` }],
  });

  const raw = extractText(response).trim();
  try {
    const cleaned = raw.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned) as { trustScore: number; aiTags: string[] };
    return {
      trustScore: Math.max(0, Math.min(100, Math.round(parsed.trustScore))),
      aiTags:     Array.isArray(parsed.aiTags) ? parsed.aiTags.slice(0, 4) : [],
      verified:   parsed.trustScore >= 70,
    };
  } catch {
    const len = text.trim().length;
    const trustScore = len > 120 ? 72 : len > 50 ? 55 : 28;
    return { trustScore, aiTags: [], verified: trustScore >= 70 };
  }
}

// ── 3. generateTourPlan ────────────────────────────────
export async function generateTourPlan(tourData: TourData, locations: Location[]): Promise<string> {
  const list = locations
    .map((l) => `• ${l.name} (${l.city}): ${l.shortDesc ?? ""} — ~$${l.priceUSD}`)
    .join("\n");

  const response = await client.messages.create({
    model:      "claude-opus-4-8",
    max_tokens: 2500,
    messages: [{
      role:    "user",
      content: `O'zbekiston bo'ylab batafsil tur rejasini tuzing:
Davomiylik: ${tourData.days} kun | Kishilar: ${tourData.people}
Viloyatlar: ${tourData.regions.join(", ")} | Byudjet: ${tourData.budget}

Mavjud joylar:\n${list || "Barcha mashhur joylar"}

Har kun uchun format:
📅 N-KUN: SHAHAR
🌅 Ertalab: joy — vaqt — narx
🍽️ Tushlik: restoran — narx
🏛️ Tushdan keyin: joy — vaqt — narx
🏨 Yotish: mehmonxona — narx
💰 Kunlik jami: ~X so'm (~$Y)
---
💰 TUR JAMI: ~X so'm (~$Y)`,
    }],
  });
  return extractText(response);
}

// ── 4. generateInsight ─────────────────────────────────
export async function generateInsight(locationName: string, reviews: ReviewForInsight[]): Promise<string> {
  if (!reviews.length) {
    return `📌 ${locationName} haqida hali yetarli sharhlar yo'q.\n📌 Birinchi bo'lib sharh qoldiring!`;
  }

  const avg = (reviews.reduce((s, r) => s + r.stars, 0) / reviews.length).toFixed(1);
  const summary = reviews
    .slice(0, 15)
    .map((r) => `[${r.stars}★, ishonch:${r.trustScore}%] "${r.text.slice(0, 120)}"`)
    .join("\n");

  const response = await client.messages.create({
    model:      "claude-sonnet-4-6",
    max_tokens: 600,
    messages: [{
      role:    "user",
      content: `"${locationName}" joyi haqida ${reviews.length} ta sharh (o'rtacha: ${avg}★) asosida 4-5 ta insight yozing. Har birini 📌 bilan boshlang:\n\n${summary}`,
    }],
  });
  return extractText(response);
}
