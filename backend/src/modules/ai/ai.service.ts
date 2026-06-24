import OpenAI from "openai";
import { env } from "@/config/env";
import type { Location } from "@prisma/client";
import { KNOWLEDGE_BASE } from "@/data/knowledge-base";

const client = new OpenAI({
  apiKey: env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export interface ChatMessage  { role: "user" | "assistant"; content: string; }
export interface UserContext  { name?: string; country?: string; plan?: string; }
export interface TourData     { days: string; people: string; regions: string[]; budget: string; }
export interface ReviewForInsight { author: string; stars: number; text: string; trustScore: number; }
export interface AnalysisResult   { trustScore: number; aiTags: string[]; verified: boolean; }

function getText(response: OpenAI.Chat.Completions.ChatCompletion): string {
  return response.choices[0]?.message?.content ?? "";
}

// ── 1. chat ────────────────────────────────────────────
export async function chat(messages: ChatMessage[], ctx: UserContext = {}): Promise<string> {
  const hasPlan = ctx.plan && ctx.plan.trim().length > 0;

  const system = `Sen MrTour.uz AI sayohat yordamchisi Bek san. O'zbekiston turizmi bo'yicha tajribali professional maslahatchi.
Foydalanuvchi: ${ctx.name ?? "Mehmon"}${ctx.country ? `, ${ctx.country}` : ""}.
${hasPlan ? `Foydalanuvchi saqlagan joylar: ${ctx.plan}.` : ""}

Quyida MrTour.uz platformasining TO'LIQ MA'LUMOTLAR BAZASI berilgan.
Bu ma'lumotlar haqiqiy va aniq — foydalanuvchi narx, vaqt, transport haqida so'rasa,
shu ma'lumotlardan foydalangin. O'z bilimingdan emas, ma'lumotlar bazasidan javob ber.

${KNOWLEDGE_BASE}

═══════════════════════════════════════════════════════
TUR REJA TUZISH — QATTIQ QOIDALAR
═══════════════════════════════════════════════════════
Foydalanuvchi tur reja, marshrut yoki sayohat rejasi so'rasa —
DARHOL reja tuzma! Avval 4 savolni bittadan ber, javob kutib keyingisini ber:

SAVOL 1: 🗓️ Qachon sayohat qilmoqchisiz? (oy yoki mavsum)
SAVOL 2: ⏱️ Necha kun vaqtingiz bor?
SAVOL 3: 👥 Nechi kishi borasiz? (yolg'iz / juft / oila / guruh)
SAVOL 4: 💰 Byudjet: tejamkor (<$30/kun) | o'rtacha ($30–80/kun) | premium ($80+/kun)?

Barcha 4 savol javoblangach — MA'LUMOTLAR BAZASIDAGI HAQIQIY narx va vaqtlarni
ishlatib quyidagi PROFESSIONAL FORMAT bilan tur rejasi tuz:

╔══════════════════════════════════════╗
║  🇺🇿 [N]-KUNLIK TUR REJASI          ║
║  [Shaharlar: Samarqand → Buxoro...] ║
╚══════════════════════════════════════╝

📅 1-KUN — [SHAHAR NOMI]
━━━━━━━━━━━━━━━━━━━━━━━━
🌅 Ertalab (09:00–13:00)
   📍 [Joy nomi] — [Qisqa tavsif] — ⏱ [Muddat] — 💵 [Aniq narx so'mda va $da]
🍽️ Tushlik (13:00–14:30)
   🍴 [MA'LUMOTLAR BAZASIDAGI restoran] — ~[Aniq taom narxi]
🏛️ Tushdan keyin (15:00–18:00)
   📍 [Joy nomi] — [Tavsif] — ⏱ [Muddat] — 💵 [Narx]
🌆 Kechqurun (19:00–21:00)
   🚶 [Sayr yoki kechki tadbir — bepul yoki narx]
🏨 Tunash
   🛏️ [MA'LUMOTLAR BAZASIDAGI mehmonxona] — [Aniq narx so'mda/$da]
💰 Kunlik jami: ~[X so'm] (~$[Y])

... (har kun uchun bir xil format)

╔══════════════════════════════════════╗
║         📊 UMUMIY XULOSA            ║
╚══════════════════════════════════════╝
👥 Kishilar: [N] | 🗓️ Muddat: [N] kun
💰 JAMI TAXMINIY (kishi boshiga):
   🎫 Kirish biletlari: ~$[X]
   🏨 Turar joy ([N] kecha): ~$[X]
   🍽️ Ovqat ([N] kun): ~$[X]
   🚌 Transport: ~$[X]
   📊 JAMI: ~$[X]–$[Y]

💡 MASLAHATLAR:
• [Mavsumga oid maslahat — ma'lumotlar bazasidan]
• [Kiyim/tayyorgarlik]
• [Pul/viza]
• [Tejash usuli]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
═══════════════════════════════════════════════════════

BOSHQA QOIDALAR:
- Saqlangan joylarni ALBATTA rejaga qo'sh (agar bo'lsa), boshqa joylar ham qo'sh
- FAQAT ma'lumotlar bazasidagi HAQIQIY narx va vaqtlarni ishlatgin
- Savol tiliga mos javob ber (uz/ru/en)
- Oddiy savollarga qisqa (100–150 so'z), tur reja uchun to'liq format
- Noaniq, taxminiy, "qarang interneta" kabi javoblar berma — aniq bo'l`;

  const response = await client.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    max_tokens: 1800,
    messages: [
      { role: "system", content: system },
      ...messages.slice(-14),
    ],
  });
  return getText(response);
}

// ── 2. analyzeReview ───────────────────────────────────
export async function analyzeReview(text: string, stars: number): Promise<AnalysisResult> {
  const response = await client.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
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
  });

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

  const response = await client.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    max_tokens: 3000,
    messages: [
      {
        role: "system",
        content: `Sen MrTour.uz professional tur rejasi generatorisin. Quyidagi ma'lumotlar bazasidagi HAQIQIY narx va vaqtlarni ishlat:\n${KNOWLEDGE_BASE}`,
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

QATTIQ FORMAT — har kun uchun:
📅 N-KUN — SHAHAR
🌅 Ertalab (09:00–13:00): joy — vaqt — narx so'mda/$da
🍽️ Tushlik (13:00–14:30): restoran — taom — narx
🏛️ Tushdan keyin (15:00–18:00): joy — vaqt — narx
🌆 Kechqurun (19:00–21:00): faoliyat
🏨 Tunash: mehmonxona — narx/kecha
💰 Kunlik jami: ~X so'm (~$Y)

Oxirida UMUMIY XULOSA (kirish biletlari / turar joy / ovqat / transport / JAMI) va MASLAHATLAR.`,
      },
    ],
  });
  return getText(response);
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

  const response = await client.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    max_tokens: 600,
    messages: [
      {
        role: "user",
        content: `"${locationName}" joyi haqida ${reviews.length} ta sharh (o'rtacha: ${avg}★) asosida 4-5 ta insight yozing. Har birini 📌 bilan boshlang:\n\n${summary}`,
      },
    ],
  });
  return getText(response);
}
