import OpenAI from "openai";
import { env } from "@/config/env";
import type { Location } from "@prisma/client";
import { KNOWLEDGE_BASE } from "@/data/knowledge-base";
import { createError } from "@/middleware/error-handler";

const client = new OpenAI({
  apiKey: env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// Groq periodically retires/renames preview models (this one, llama-4-scout,
// 404'd with "model_not_found" after being live for months) — kept as a
// single constant instead of four repeated string literals so a future
// swap is a one-line change instead of a grep-and-replace.
const MODEL = "llama-3.3-70b-versatile";

export interface ChatMessage  { role: "user" | "assistant"; content: string; }
export interface UserContext  { name?: string; country?: string; plan?: string; lang?: string; }

// Human-readable names the model can act on reliably — passing the raw
// locale code ("zh") alone was less consistent than naming the language.
const LANG_NAMES: Record<string, string> = {
  uz: "Uzbek",
  ru: "Russian",
  en: "English",
  zh: "Chinese",
  de: "German",
  fr: "French",
};
export interface TourData     { days: string; people: string; regions: string[]; budget: string; }
export interface ReviewForInsight { author: string; stars: number; text: string; trustScore: number; }
export interface AnalysisResult   { trustScore: number; aiTags: string[]; verified: boolean; }

function getText(response: OpenAI.Chat.Completions.ChatCompletion): string {
  return response.choices[0]?.message?.content ?? "";
}

// A failed upstream call (invalid/expired GROQ_API_KEY, rate limit, network
// blip) was propagating as an unhandled exception — the error handler had
// no case for it, so it fell through to a bare 500 "Internal server error"
// with no diagnostic trail and nothing actionable for the user. Log the
// real cause here (visible in server logs regardless of NODE_ENV) and
// surface a clean, operational error instead.
async function callGroq<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error("[ai.service] Groq API call failed:", err);
    throw createError("Trova AI vaqtincha ishlamayapti. Birozdan keyin qayta urinib ko'ring.", 503);
  }
}

// ── 1. chat ────────────────────────────────────────────
export async function chat(messages: ChatMessage[], ctx: UserContext = {}): Promise<string> {
  const hasPlan = ctx.plan && ctx.plan.trim().length > 0;
  const interfaceLang = LANG_NAMES[ctx.lang ?? ""] ?? "English";

  const system = `Sen Trova AI — trova sayohat platformasining sun'iy intellekt yordamchisisan. O'zbekiston turizmi bo'yicha tajribali professional maslahatchi.
Foydalanuvchi: ${ctx.name ?? "Mehmon"}${ctx.country ? `, ${ctx.country}` : ""}.
${hasPlan ? `Foydalanuvchi saqlagan joylar: ${ctx.plan}.` : ""}

LANGUAGE RULE (highest priority, overrides everything else in this
prompt including the language this prompt itself is written in):
Respond in ${interfaceLang} — that's the app's current interface
language — UNLESS the user's message is clearly written in a
different language, in which case respond in THAT language for this
reply instead (matching what they just typed always wins over the
interface default). Never default to Uzbek just because parts of
this instruction are in Uzbek.

Quyida trova platformasining TO'LIQ MA'LUMOTLAR BAZASI berilgan.
Bu ma'lumotlar haqiqiy va aniq — foydalanuvchi narx, vaqt, transport haqida so'rasa,
shu ma'lumotlardan foydalangin. O'z bilimingdan emas, ma'lumotlar bazasidan javob ber.

${KNOWLEDGE_BASE}

## TUR REJA TUZISH — QATTIQ QOIDALAR

Foydalanuvchi tur reja, marshrut yoki sayohat rejasi so'rasa —
DARHOL reja tuzma! Avval 4 savolni bittadan ber, javob kutib keyingisini ber:

1. Qachon sayohat qilmoqchisiz? (oy yoki mavsum)
2. Necha kun vaqtingiz bor?
3. Nechi kishi borasiz? (yolg'iz / juft / oila / guruh)
4. Byudjet: tejamkor (<$30/kun) | o'rtacha ($30–80/kun) | premium ($80+/kun)?

Barcha 4 savol javoblangach — MA'LUMOTLAR BAZASIDAGI HAQIQIY narx va vaqtlarni
ishlatib **markdown formatida** (quyidagi kabi, boshqacha emas) tur rejasi tuz.
EMOJI HECH QACHON ishlatma — birortasi ham, hech qanday holatda. Bu jumladan
xarita, taom, yulduz va boshqa "oddiy" emojilarni ham o'z ichiga oladi.
Ovoz professional va sokin bo'lishi kerak — faqat toza markdown (**bold**,
## sarlavhalar, - ro'yxatlar) ishlat. Bayroq-emoji va rasm chizuvchi
belgilarni (═ ║ ╔ ╚ ━) HAM HECH QACHON ishlatma — ular ko'p qurilmada
noto'g'ri yoki singan holda ko'rinadi.

**Namuna format:**

## [N]-kunlik tur rejasi — Samarqand → Buxoro

### 1-kun — Samarqand

**Ertalab (09:00–13:00)**
- Registon — tarixiy me'moriy ansambl — 2–3 soat — 50 000 so'm (~$4)

**Tushlik (13:00–14:30)**
- Samarqand Darvoza — ~35 000 so'm (~$2.7)

**Tushdan keyin (15:00–18:00)**
- Guri Amir maqbarasi — 1 soat — 30 000 so'm (~$2)

**Kechqurun (19:00–21:00)**
- Erkin sayr yoki kechki tadbir

**Tunash:** [MA'LUMOTLAR BAZASIDAGI mehmonxona] — narx/kecha

**Kunlik jami:** ~X so'm (~$Y)

... (har kun uchun shu formatda davom et)

### Umumiy xulosa

- Kishilar: [N] | Muddat: [N] kun
- Kirish biletlari: ~$[X]
- Turar joy ([N] kecha): ~$[X]
- Ovqat ([N] kun): ~$[X]
- Transport: ~$[X]
- **Jami: ~$[X]–$[Y]**

### Maslahatlar

- [Mavsumga oid maslahat — ma'lumotlar bazasidan]
- [Kiyim/tayyorgarlik]
- [Pul/viza]
- [Tejash usuli]

BOSHQA QOIDALAR:
- Saqlangan joylarni ALBATTA rejaga qo'sh (agar bo'lsa), boshqa joylar ham qo'sh
- FAQAT ma'lumotlar bazasidagi HAQIQIY narx va vaqtlarni ishlatgin
- Til bo'yicha yuqoridagi LANGUAGE RULE'ga qat'iy amal qil
- Oddiy savollarga qisqa (100–150 so'z, markdown shart emas), tur reja uchun to'liq format
- Noaniq, taxminiy, "qarang interneta" kabi javoblar berma — aniq bo'l`;

  const response = await callGroq(() => client.chat.completions.create({
    model: MODEL,
    max_tokens: 1800,
    messages: [
      { role: "system", content: system },
      ...messages.slice(-14),
    ],
  }));
  return getText(response);
}

// ── 2. analyzeReview ───────────────────────────────────
export async function analyzeReview(text: string, stars: number): Promise<AnalysisResult> {
  const response = await callGroq(() => client.chat.completions.create({
    model: MODEL,
    max_tokens: 200,
    messages: [
      {
        role: "system",
        content: `Return ONLY valid JSON, no markdown:
{"trustScore":number,"aiTags":string[]}
trustScore: 70-100=genuine detail, 40-69=generic/short, 0-39=spam/bot
aiTags: 2-4 uzbek topic keywords`,
      },
      { role: "user", content: `Review (${stars} stars): "${text}"` },
    ],
  }));

  const raw = getText(response).trim();
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

  const response = await callGroq(() => client.chat.completions.create({
    model: MODEL,
    max_tokens: 3000,
    messages: [
      {
        role: "system",
        content: `Sen trova platformasining professional tur rejasi generatorisan. Quyidagi ma'lumotlar bazasidagi HAQIQIY narx va vaqtlarni ishlat:\n${KNOWLEDGE_BASE}`,
      },
      {
        role: "user",
        content: `Quyidagi parametrlar asosida PROFESSIONAL tur rejasi tuz:
Davomiylik: ${tourData.days} kun
Kishilar: ${tourData.people}
Viloyatlar: ${tourData.regions.join(", ")}
Byudjet: ${tourData.budget}

Borilishi kerak bo'lgan joylar:
${list || "Barcha mashhur joylar (ma'lumotlar bazasidan tanlang)"}

Markdown formatida yoz. EMOJI HECH QACHON ishlatma, bayroq-emoji va
═ ║ ╔ ╚ ━ kabi chizuvchi belgilarni ham ishlatma — ovoz professional
va sokin bo'lishi kerak:

### N-kun — Shahar
**Ertalab (09:00–13:00):** joy — vaqt — narx so'mda/$da
**Tushlik (13:00–14:30):** restoran — taom — narx
**Tushdan keyin (15:00–18:00):** joy — vaqt — narx
**Kechqurun (19:00–21:00):** faoliyat
**Tunash:** mehmonxona — narx/kecha
**Kunlik jami:** ~X so'm (~$Y)

Oxirida "### Umumiy xulosa" (kirish biletlari / turar joy / ovqat / transport / jami) va "### Maslahatlar" bo'limlari.`,
      },
    ],
  }));
  return getText(response);
}

// ── 4. generateInsight ─────────────────────────────────
export async function generateInsight(locationName: string, reviews: ReviewForInsight[], lang?: string): Promise<string> {
  if (!reviews.length) {
    return `${locationName} haqida hali yetarli sharhlar yo'q.\nBirinchi bo'lib sharh qoldiring!`;
  }

  const avg = (reviews.reduce((s, r) => s + r.stars, 0) / reviews.length).toFixed(1);
  const summary = reviews
    .slice(0, 15)
    .map((r) => `[${r.stars}★, ishonch:${r.trustScore}%] "${r.text.slice(0, 120)}"`)
    .join("\n");
  const interfaceLang = LANG_NAMES[lang ?? ""] ?? "English";

  const response = await callGroq(() => client.chat.completions.create({
    model: MODEL,
    max_tokens: 600,
    messages: [
      {
        role: "user",
        content: `"${locationName}" joyi haqida ${reviews.length} ta sharh (o'rtacha: ${avg}★) asosida 4-5 ta insight yozing. Har birini "- " bilan boshlang (markdown ro'yxat), emoji ishlatma. Javobni albatta ${interfaceLang} tilida yoz:\n\n${summary}`,
      },
    ],
  }));
  return getText(response);
}
