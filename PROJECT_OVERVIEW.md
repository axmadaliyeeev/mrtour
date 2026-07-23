# trova — Loyiha haqida qisqacha

O'zbekiston bo'ylab sayohat qilishni rejalashtirish uchun AI-quvvatlangan full-stack veb-ilova. Foydalanuvchilar diqqatga sazovor joylarni ko'rib chiqadi, ularni shaxsiy rejaga saqlaydi, sharh qoldiradi va **Trova AI** — sun'iy intellekt sayohat yordamchisi bilan suhbatlashib tur reja tuzdiradi.

## Texnologik stek

| Qatlam           | Texnologiya                                                        |
| ---------------- | ------------------------------------------------------------------ |
| Frontend         | React 19 + TypeScript + Vite, Tailwind CSS, Framer Motion, Zustand |
| Backend          | Express.js + TypeScript, Prisma ORM                                |
| Baza             | PostgreSQL (Neon, serverless)                                      |
| Sun'iy intellekt | Groq API — `llama-3.3-70b-versatile`                               |
| Autentifikatsiya | JWT (qisqa muddatli access + refresh token, httpOnly cookie)       |
| Deploy           | Frontend — Vercel, Backend — Render, Baza — Neon                   |

## Asosiy funksionallik

- **Joylar katalogi** — 12 ta lokatsiya (Samarqand, Buxoro, Xiva, Toshkent va h.k.), kategoriya/shahar/narx bo'yicha filtr va qidiruv
- **Trova AI** — ko'p tilli suhbat, savol-javob, tezkor mavzular, tur reja tuzish (4 bosqichli so'rov: sana → muddat → kishilar → byudjet), javoblar Markdown formatida chiroyli render qilinadi
- **SmartReview** — har bir sharh AI orqali ishonchlilik balli (trustScore) va mavzu teglari bilan tahlil qilinadi; joy bo'yicha AI-xulosalar generatsiyasi
- **Shaxsiy reja** — joylarni saqlash, mehmon va tizimga kirgan foydalanuvchi uchun ishlaydi, login qilinganda qurilmalar orasida avtomatik sinxronlanadi
- **6 tillilik** — o'zbek, rus, ingliz, xitoy, nemis, fransuz (barcha matn va AI javoblari)
- **Global qidiruv** — Ctrl+K buyruq paneli (tezkor navigatsiya, tasodifiy joy, mavzu almashtirish)
- **To'liq responsiv** — mobil pastki navigatsiya, desktop yon panel, barcha ekran o'lchamlarida moslashuvchan

## Loyiha tuzilmasi

```
trova/
├── frontend/   React SPA — sahifalar, komponentlar, i18n, Zustand store
└── backend/    Express API — auth, joylar, sharhlar, AI, foydalanuvchilar
```

## Dizayn tili

"trova" firma uslubi — yagona Emerald Green (#50C878) aksent rangi, Dark Evergreen (#013220) fon va Mint Whisper (#D1F2EB) kontrast nuqtalaridan iborat monosabz palitra; logotipdagi marshrut (route) chizig'i sidebar, kartalar hover holati va tur-reja progressida takrorlanuvchi vizual motiv sifatida ishlatiladi. Animatsiyalar faqat holatga bog'liq (masalan, Trova AI javob yozayotgandagina aylanuvchi indikator ishlaydi), dekorativ emas.

## Ishonchlilik va barqarorlik

- Serverless baza (Neon) uyg'onishi uchun avtomatik qayta urinish mantig'i
- Cross-origin (Vercel ↔ Render) uchun to'g'ri sozlangan CORS va cookie'lar
- AI so'rovlari uchun uzaytirilgan timeout (bepul-tarif serverning "sovuq start"ini hisobga olgan holda)
- Barcha asosiy oqimlar (ro'yxatdan o'tish, kirish, chat, reja saqlash) uchun aniq xato xabarlari

---

_To'liq texnik hujjat, API endpointlar ro'yxati va ishga tushirish yo'riqnomasi uchun [README.md](README.md) ga qarang._
