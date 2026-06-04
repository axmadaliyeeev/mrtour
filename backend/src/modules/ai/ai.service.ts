import Anthropic from "@anthropic-ai/sdk";
import { env } from "@/config/env";
import type { ILocation } from "@/modules/locations/location.model";

const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

// ── Shared types ──────────────────────────────────────
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface UserContext {
  name?: string;
  country?: string;
  plan?: string;
}

export interface TourData {
  days: string;
  people: string;
  regions: string[];
  budget: string;
}

export interface ReviewForInsight {
  author: string;
  stars: number;
  text: string;
  trustScore: number;
}

export interface AnalysisResult {
  trustScore: number;
  aiTags: string[];
  verified: boolean;
}

// ── Helper ────────────────────────────────────────────
function extractText(response: Anthropic.Message): string {
  for (const block of response.content) {
    if (block.type === "text") return block.text;
  }
  return "";
}

// ── 1. Chat ───────────────────────────────────────────
export async function chat(
  messages: ChatMessage[],
  userContext: UserContext = {}
): Promise<string> {
  const systemPrompt = `Sen MrTour.uz AI yordamchisi Bek san.
O'zbekiston turizmi bo'yicha mutaxassis.
Foydalanuvchi: ${userContext.name ?? "Mehmon"}, ${userContext.country ?? "noma'lum mamlakat"}.
Rejalashtirilgan joylar: ${userContext.plan ?? "hali yo'q"}.
QOIDALAR:
- Faqat O'zbekiston turizmi haqida javob ber
- Savol tilida (uz/ru/en) javob ber
- Tur reja so'ralsa: avval 4 savol ber (kunlar, kishilar, viloyat, byudjet), keyin kun-kun jadval tuz
- Narxlarni so'm va USD da ko'rsat (1 USD = 12800 so'm)
- Maksimal 200 so'z, emoji ishlatib yoqimli qil
- Noreal savolga: "Bu savolga javob berolmayman, lekin O'zbekiston sayohati haqida yordam bera olaman"`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 800,
    system: systemPrompt,
    messages: messages.slice(-10),
  });

  return extractText(response);
}

// ── 2. analyzeReview ──────────────────────────────────
export async function analyzeReview(
  text: string,
  stars: number
): Promise<AnalysisResult> {
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 200,
    system: `Return ONLY valid JSON, no markdown, no explanation:
{"trustScore": number, "aiTags": string[]}

trustScore rules (0-100):
- 70-100: specific place/time mentioned, genuine emotions, practical tips, detailed experience
- 40-69: short or generic review, vague praise/criticism, possibly new account pattern
- 0-39: spam patterns, bot-like repetition, only exclamations, irrelevant content, aggression

aiTags: 2-4 concise uzbek topic keywords from the review text`,
    messages: [
      {
        role: "user",
        content: `Review (${stars} out of 5 stars): "${text}"`,
      },
    ],
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
    // Heuristic fallback when JSON parse fails
    const len = text.trim().length;
    const trustScore = len > 120 ? 72 : len > 50 ? 55 : 28;
    return { trustScore, aiTags: [], verified: trustScore >= 70 };
  }
}

// ── 3. generateTourPlan ───────────────────────────────
export async function generateTourPlan(
  tourData: TourData,
  locations: ILocation[]
): Promise<string> {
  const locationList = locations
    .map((l) => `• ${l.name} (${l.city}): ${l.shortDesc ?? ""} — ~$${l.priceUSD}`)
    .join("\n");

  const response = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 2500,
    messages: [
      {
        role: "user",
        content: `O'zbekiston bo'ylab batafsil tur rejasini tuzing:

📋 TUR MA'LUMOTLARI:
• Davomiylik: ${tourData.days} kun
• Kishilar: ${tourData.people}
• Viloyatlar: ${tourData.regions.join(", ")}
• Byudjet: ${tourData.budget}

🗺️ MAVJUD JOYLAR:
${locationList || "Barcha mashhur joylar"}

Har kun uchun quyidagi ANIQ formatda yozing:

📅 N-KUN: SHAHAR NOMI
🌅 Ertalab (09:00): joy — vaqt — narx (so'm)
🍽️ Tushlik (13:00): restoran — narx (so'm)
🏛️ Tushdan keyin (15:00): joy — vaqt — narx (so'm)
🌆 Kechqurun (19:00): faoliyat — narx (so'm)
🏨 Yotish: mehmonxona — narx (so'm)
💰 Kunlik jami: ~X so'm (~$Y)

---
💰 TUR JAMI ${tourData.days} kun, ${tourData.people}: ~X so'm (~$Y)
📌 Transport xarajatlar (taxminiy): ~X so'm
📌 Ovqat (taxminiy): ~X so'm
📌 Kirish chiptalari: ~X so'm`,
      },
    ],
  });

  return extractText(response);
}

// ── 4. generateInsight ────────────────────────────────
export async function generateInsight(
  locationName: string,
  reviews: ReviewForInsight[]
): Promise<string> {
  if (reviews.length === 0) {
    return `📌 ${locationName} haqida hali yetarli sharhlar mavjud emas.\n📌 Birinchi bo'lib sharh qoldirib, boshqalarga yordam bering!`;
  }

  const avgRating = (reviews.reduce((s, r) => s + r.stars, 0) / reviews.length).toFixed(1);
  const summary = reviews
    .slice(0, 15)
    .map((r) => `[${r.stars}★, ishonch: ${r.trustScore}%] "${r.text.slice(0, 120)}"`)
    .join("\n");

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 600,
    messages: [
      {
        role: "user",
        content: `"${locationName}" joyi haqida ${reviews.length} ta sharh (o'rtacha: ${avgRating}★) asosida 4-5 ta qisqa va amaliy insight yozing.
Har birini 📌 bilan boshlang, yangi qatordan.

SHARHLAR:
${summary}

FORMAT:
📌 [umumiy taassurot / eng ko'p tilga olingan xususiyat]
📌 [sayohatchilar uchun amaliy maslahat]
📌 [eng yaxshi vaqt yoki sharoit]
📌 [ehtiyot bo'lish kerak bo'lgan jihat]
📌 [ushbu joydagi noyob tajriba]`,
      },
    ],
  });

  return extractText(response);
}
