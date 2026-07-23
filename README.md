# trova

[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.4-646cff?logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Groq AI](https://img.shields.io/badge/Groq_AI-Llama_3.3-f55036)](https://groq.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?logo=postgresql)](https://neon.tech)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

O'zbekiston turizmi uchun AI-powered full-stack veb-ilova. Groq AI (Llama 3.3 70B) bilan shaxsiy tur rejalash, real vaqt sharh tahlili va interaktiv sayohat yordamchisi **Trova AI**.

---

## Loyiha tuzilmasi

```
trova/
├── frontend/                    # React 19 + Vite + Tailwind CSS
│   └── src/
│       ├── components/
│       │   ├── auth/            # AuthModal (login + ro'yxatdan o'tish)
│       │   ├── layout/          # Sidebar, BottomNav, TopHeader, MainLayout
│       │   ├── locations/       # LocationCard (skeleton loading, bookmark animatsiya)
│       │   └── ui/              # Stars, Toaster
│       ├── data/                # 8 ta lokatsiya + sharhlar + restoranlar/hotellar/gidlar
│       │   ├── index.ts         # LOCATIONS, RESTAURANTS, HOTELS, GUIDES, CURRENCY_RATES
│       │   └── *.jpg/avif/jpeg  # Mahalliy lokatsiya rasmlari (Vite import)
│       ├── hooks/
│       │   ├── useBreakpoint.ts # Mobile/tablet/desktop aniqlash
│       │   ├── useInView.ts     # IntersectionObserver (entrance animatsiyalar)
│       │   └── useAuth.ts       # Token tekshirish
│       ├── i18n/
│       │   └── translations.ts  # 6 til: uz/ru/en/zh/de/fr — 150+ kalit
│       ├── lib/
│       │   ├── api-client.ts    # Axios + JWT interceptor (auto token refresh)
│       │   └── utils.ts         # cn() helper
│       ├── pages/
│       │   ├── Home.tsx         # Hero, featured, stats, AI banner
│       │   ├── Locations.tsx    # Grid, filtr (kategoriya + shahar + saralash)
│       │   ├── LocationDetail.tsx # Hero, ma'lumotlar, sharhlar, SmartReview AI
│       │   ├── Chat.tsx         # Trova AI suhbat sahifasi
│       │   ├── Services.tsx     # Restoranlar, hotellar, gidlar, transport, valyuta
│       │   └── Profile.tsx      # Reja boshqaruv, til, mavzu, favqulodda raqamlar
│       ├── store/
│       │   └── index.ts         # Zustand (user, plan, theme, lang, toasts, reviews)
│       └── types/               # TypeScript interfeyslari
│
└── backend/                     # Express.js + TypeScript + Prisma
    └── src/
        ├── config/
        │   └── env.ts           # Zod orqali environment tekshiruvi
        ├── data/
        │   └── knowledge-base.ts # AI uchun O'zbekiston turizm ma'lumotlari
        ├── lib/
        │   └── prisma.ts        # Prisma client + withRetry (Neon wake-up)
        ├── middleware/
        │   ├── auth.ts          # JWT Bearer token tekshirish
        │   ├── error-handler.ts # Global xato boshqaruvi
        │   └── validate.ts      # Zod schema validatsiya
        ├── modules/
        │   ├── ai/              # Groq API: chat, review tahlili, tur rejasi, insight
        │   ├── auth/            # JWT register/login/refresh/logout
        │   ├── locations/       # Joylar + filtr + qidiruv
        │   ├── reviews/         # Sharhlar + AI trustScore
        │   └── users/           # Profil + reja boshqaruv
        └── utils/
            └── jwt.ts           # Token yaratish va tekshirish
```

---

## Texnologiyalar

| Qatlam | Texnologiya | Versiya |
|--------|-------------|---------|
| **Frontend** | React + Vite | 19 / 6.4 |
| **UI** | Tailwind CSS + Radix UI (Dialog) | 3.4 / 1.x |
| **State** | Zustand (persist middleware) | 5.0 |
| **Router** | React Router | 6.x |
| **HTTP** | Axios (JWT interceptor) | 1.7 |
| **Icons** | Lucide React | Latest |
| **i18n** | Custom hook (6 til) | — |
| **Backend** | Express.js + TypeScript | 4.21 |
| **ORM** | Prisma | 6.x |
| **Database** | PostgreSQL (Neon serverless) | 16 |
| **AI** | Groq API (Llama 3.3 70B + 3.1 8B) | Latest |
| **Auth** | JWT (access 15m + refresh 7d) | — |

---

## AI funksiyalar

### 1. Trova AI — sayohat yordamchisi
`llama-3.3-70b-versatile` modeli bilan ishlaydi. O'zbekiston turizmi bo'yicha professional chatbot.

- Savolga javob beradi: narxlar, vaqt, transport, mavsumlar
- Tur rejasi tuzadi (4 savol: muddat → kishilar → viloyat → byudjet)
- Foydalanuvchi saqlagan joylarni reja ichiga qo'shadi
- 6 tilda javob beradi (uz/ru/en/zh/de/fr)

```
Model:    llama-3.3-70b-versatile
Endpoint: POST /api/ai/chat
Limit:    20 so'rov/daqiqa
Context:  so'nggi 14 xabar + KNOWLEDGE_BASE
```

### 2. SmartReview — sharh tahlili
Har yangi sharh `llama-3.1-8b-instant` orqali tahlil qilinadi:

- `trustScore` (0–100): haqiqiylik darajasi
- `aiTags`: mavzu teglar (o'zbekcha)
- `verified` belgisi (70+ ball)

```
Model:    llama-3.1-8b-instant
Endpoint: POST /api/ai/analyze-review
Trigger:  Har yangi sharh qo'shilganda avtomatik
Fallback: Matn uzunligiga asoslangan hisoblash (AI ishlamasa)
```

### 3. Joy insayti generatori
`llama-3.3-70b-versatile` so'nggi 15 sharhni tahlil qilib 4–5 ta insight yaratadi.

```
Endpoint: POST /api/ai/analyze-reviews
Trigger:  LocationDetail sahifasida "AI tahlil" tugmasi bosilganda
Cache:    So'rovga qadar saqlanadi (reload qilingunga)
```

### 4. Tur rejasi generatori
To'liq parametrlar (kun, kishilar, viloyat, byudjet) asosida kun-kun jadval.

```
Endpoint: POST /api/ai/tour-plan
Auth:     Login talab qilinmaydi
```

---

## Ilova bo'limlari

| Bo'lim | Tavsif |
|--------|--------|
| 🏠 **Asosiy** | Featured joylar, statistika, Trova AI banneri, havolalar |
| 📍 **Joylar** | 8 lokatsiya, kategoriya/shahar/saralash filtri, skeleton loading |
| 🗺️ **Joy tafsiloti** | Hero rasm, ma'lumotlar, SmartReview AI, sharhlar, rejaga qo'shish |
| 🤖 **Trova AI** | Suhbat sahifasi, tezkor savollar, tur rejasi banneri |
| ⚙️ **Xizmatlar** | Restoranlar, hotellar, gidlar, transport marshrutlari, valyuta konvertori |
| 👤 **Profil** | Reja ro'yxati (mehmon + foydalanuvchi), til tanlash, mavzu, favqulodda raqamlar |

---

## API endpointlar

```
POST   /api/auth/register        Yangi hisob (name, surname, email, password, country, lang)
POST   /api/auth/login           Kirish (email, password)
POST   /api/auth/refresh         Access token yangilash
DELETE /api/auth/logout          Chiqish (refresh token o'chirish)
GET    /api/auth/me              Joriy foydalanuvchi ma'lumotlari

GET    /api/locations            Joylar ro'yxati (filter: category, city, search)
GET    /api/locations/featured   Featured joylar (bosh sahifa uchun)
GET    /api/locations/:id        Joy tafsilotlari

GET    /api/reviews/:locationId  Joy sharhlari (saralangan: yangi birinchi)
POST   /api/reviews              Yangi sharh (AI tahlil bilan)
DELETE /api/reviews/:id          Sharhni o'chirish (faqat muallif)

POST   /api/ai/chat              Trova AI suhbati (messages array + userContext)
POST   /api/ai/analyze-review    Sharh tahlili → trustScore + aiTags
POST   /api/ai/analyze-reviews   Joy insayti generatsiyasi
POST   /api/ai/tour-plan         Tur rejasi (days, people, regions, budget)

PATCH  /api/users/me             Profilni yangilash (name, country, lang)
GET    /api/users/me/plan        Foydalanuvchi rejasi
POST   /api/users/me/plan        Rejaga joy qo'shish
DELETE /api/users/me/plan/:id    Rejadan o'chirish
```

---

## Ishga tushirish

### Kerakli muhit o'zgaruvchilari

**`backend/.env`:**
```env
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require&connect_timeout=30"
JWT_SECRET="kamida-32-belgi"
JWT_REFRESH_SECRET="kamida-32-belgi"
GROQ_API_KEY="gsk_..."
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**`frontend/.env`** (ixtiyoriy):
```env
VITE_API_URL=http://localhost:5000/api
```

### Ishga tushirish

```bash
# 1. Reponi clone qilish
git clone https://github.com/axmadaliyeeev/trova.git
cd trova

# 2. Backend
cd backend
npm install
npm run dev        # http://localhost:5000

# 3. Frontend (yangi terminal)
cd frontend
npm install
npm run dev        # http://localhost:5173

# 4. Prisma migratsiya (birinchi marta)
cd backend
npx prisma migrate dev
npx prisma generate
```

---

## Muhim texnik yechimlar

### Neon DB auto-pause
Neon bepul tier faolsizlikdan keyin ma'lumotlar bazasini to'xtatadi. Muammo:

```
Can't reach database server at ep-*.neon.tech:5432
```

Yechim — `backend/src/lib/prisma.ts` da `withRetry` wrapper:
- 3 urinish, eksponent kechikish (2s → 4s → 6s)
- `P1001/P1002/P1008/P1017` Prisma kodlari va tarmoq xatolarini ushlaydi
- `connect_timeout=30` DATABASE_URL da

### Mahalliy rasmlar (Vite import)
8 ta lokatsiya rasmi `frontend/src/data/` papkasida va TypeScript import orqali ulangan:

```typescript
import registanImg from "./registan.jpg";
// ...
img: registanImg  // LOCATIONS massivida
```

Vite build vaqtida rasmlarni hash nomlar bilan `dist/assets/` ga ko'chiradi.

### i18n — 6 til
`frontend/src/i18n/translations.ts` da 6 ta til ob'ekti (uz/ru/en/zh/de/fr), 150+ kalit.
Zustand store da `lang` persist qilinadi — foydalanuvchi tanlagan til qayta yuklanganda ham saqlanadi.

### Animatsiyalar
Framer Motion ishlatilmagan — faqat CSS keyframes + `useInView` hook (IntersectionObserver).
`animation-fill-mode: both` delay bilan kirish animatsiyalariga imkon beradi.

---

## Skriptlar

```bash
# Frontend (frontend/ papkasidan)
npm run dev      # Vite dev server (port 5173)
npm run build    # Production build (dist/)
npm run preview  # Build natijasini tekshirish
npm run lint     # ESLint

# Backend (backend/ papkasidan)
npm run dev      # ts-node-dev bilan (hot reload)
npm run build    # TypeScript → JavaScript (dist/)
npm run start    # Production (node dist/server.js)
```

---

## Litsenziya

[MIT](LICENSE) © 2026 trova

---

<div align="center">
  <strong>O'zbekistonni dunyo bilan tanishtirish</strong><br/>
  Made with Groq AI + Llama 3.3
</div>
