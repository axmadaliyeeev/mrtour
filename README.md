# MRTOUR.UZ 🇺🇿

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://typescriptlang.org)
[![Claude AI](https://img.shields.io/badge/Claude_AI-Anthropic-orange?logo=anthropic)](https://anthropic.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-8-green?logo=mongodb)](https://mongodb.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

O'zbekiston turizmi uchun AI-powered to'liq stack veb-ilova. Claude AI bilan shaxsiy tur rejalash, real vaqt sharh tahlili va interaktiv sayohat yordamchisi.

---

## 🚀 Tezkor boshlash

```bash
# 1. Reponi clone qilish
git clone https://github.com/axmadaliyeeev/mrtour.git
cd mrtour

# 2. Frontend sozlash
cd frontend
npm install
cp .env.local.example .env.local
# .env.local faylini to'ldiring
npm run dev          # http://localhost:3000

# 3. Backend sozlash (yangi terminal)
cd backend
npm install
cp .env.example .env
# .env faylini to'ldiring
npm run dev          # http://localhost:5000

# 4. Ikkalasini bir vaqtda ishga tushirish (root papkadan)
cd ..
npm install          # concurrently o'rnatish
npm run dev          # frontend + backend parallel
```

---

## 📁 Loyiha Tuzilmasi

```
mrtour/
├── frontend/                    # Next.js 14 App Router
│   ├── src/
│   │   ├── app/
│   │   │   └── (main)/
│   │   │       ├── chat/        # AI suhbat sahifasi
│   │   │       ├── services/    # Restoranlar, hotellar, gidlar
│   │   │       └── profile/     # Foydalanuvchi profili
│   │   ├── components/
│   │   │   ├── layout/          # Sidebar, BottomNav, TopHeader
│   │   │   ├── chat/            # MessageBubble, TourFlow, QuickActions
│   │   │   ├── review/          # ReviewCard, AIInsight, SmartPanel
│   │   │   ├── auth/            # AuthModal (login + register)
│   │   │   ├── shared/          # ThemeToggle, GoogleMapsBtn
│   │   │   └── ui/              # Stars, TrustBadge, FilterPill, SearchBar...
│   │   ├── hooks/               # useBreakpoint, useDebounce, useReviews, useAuth
│   │   ├── store/               # Zustand (user, plan, theme, activeTab)
│   │   ├── lib/                 # utils.ts, api-client.ts (axios + JWT)
│   │   ├── data/                # Statik ma'lumotlar (8 joy, 4 restoran...)
│   │   └── types/               # TypeScript interfeyslari
│   ├── tailwind.config.ts       # Brand ranglar (teal, #080e1a)
│   └── vercel.json              # Vercel deploy konfiguratsiyasi
│
└── backend/                     # Express.js REST API
    └── src/
        ├── modules/
        │   ├── ai/              # Claude AI: chat, review analysis, tour plan
        │   ├── auth/            # JWT autentifikatsiya (register/login/refresh)
        │   ├── locations/       # Joylar CRUD + qidiruv + filtrlash
        │   ├── reviews/         # Sharhlar + AI trustScore tahlili
        │   └── users/           # Profil, reja boshqaruv
        ├── middleware/          # auth, validate (Zod), error-handler
        ├── config/              # env (Zod), database (retry + graceful shutdown)
        └── utils/               # JWT helpers, API response formatters
```

---

## 🛠️ Texnologiyalar

| Qatlam         | Texnologiya                           | Versiya  |
|----------------|---------------------------------------|----------|
| **Frontend**   | Next.js (App Router)                  | 14.2     |
| **UI**         | Tailwind CSS + Radix UI               | 3.4 / 1.x |
| **State**      | Zustand (persist middleware)          | 5.0      |
| **Forms**      | React Hook Form + Zod                 | 7.x / 3.x |
| **HTTP**       | Axios (interceptors + token refresh)  | 1.7      |
| **Backend**    | Express.js + TypeScript               | 4.21     |
| **Database**   | MongoDB + Mongoose                    | 8.x      |
| **AI**         | Anthropic Claude API                  | Latest   |
| **Auth**       | JWT (access 15m + refresh 7d)         | —        |
| **Deploy FE**  | Vercel                                | —        |
| **Deploy BE**  | Railway                               | —        |

---

## 🤖 AI Funksiyalar

### 1. Bek — AI Sayohat Yordamchisi
Claude Sonnet bilan ishlaydi. O'zbekiston turizmi bo'yicha mutaxassis chatbot.
Savolga javob beradi, tur rejasi tuzadi, narxlar va transport haqida ma'lumot beradi.

```
Model:     claude-sonnet-4-6
Endpoint:  POST /api/ai/chat
Limit:     20 so'rov/daqiqa
```

### 2. Smart Review Tahlili
Har bir foydalanuvchi sharhi Claude Haiku orqali avtomatik tahlil qilinadi:
- `trustScore` (0–100): haqiqiylik darajasi
- `aiTags`: mavzu teglar
- `verified` belgisi

```
Model:     claude-haiku-4-5
Endpoint:  POST /api/ai/analyze-review
Trigger:   Har yangi sharh saqlanganda avtomatik
```

### 3. Tur Rejasi Generatori
4-bosqichli master (kun, kishilar, viloyatlar, byudjet) asosida Claude Opus
kun-kun jadval, transport, narxlar bilan batafsil tur rejasi yaratadi.

```
Model:     claude-opus-4-8
Endpoint:  POST /api/ai/tour-plan
Auth:      Login talab qilinadi
```

---

## 📱 Ilova Bo'limlari

| Bo'lim           | Tavsif                                              |
|------------------|-----------------------------------------------------|
| 🏠 **Asosiy**    | Featured joylar, AI intro, tezkor havolalar         |
| 📍 **Joylar**    | 8 UNESCO joy, filtr, qidiruv, SmartReview paneli    |
| 🤖 **AI Chat**   | Bek yordamchi, QuickActions, TourFlow master        |
| ⚙️ **Xizmatlar** | Restoranlar, hotellar, gidlar, transport, valyuta   |
| 👤 **Profil**    | Reja boshqaruv, sozlamalar, favqulodda raqamlar     |

---

## 🌐 API Endpointlar

```
POST   /api/auth/register        Yangi hisob yaratish
POST   /api/auth/login           Tizimga kirish
POST   /api/auth/refresh         Token yangilash
DELETE /api/auth/logout          Chiqish
GET    /api/auth/me              Joriy foydalanuvchi

GET    /api/locations            Joylar ro'yxati (filter + pagination)
GET    /api/locations/featured   Featured joylar (bosh sahifa)
GET    /api/locations/:id        Joy tafsilotlari

GET    /api/reviews/:locationId  Joy sharhlari
POST   /api/reviews              Yangi sharh (AI tahlil bilan)
DELETE /api/reviews/:id          Sharhni o'chirish

POST   /api/ai/chat              AI suhbat
POST   /api/ai/analyze-review    Sharh tahlili
POST   /api/ai/tour-plan         Tur rejasi (auth required)
POST   /api/ai/analyze-reviews   Joy insight generatsiyasi

PATCH  /api/users/me             Profilni yangilash
POST   /api/users/me/plan        Rejaga joy qo'shish
DELETE /api/users/me/plan/:id    Rejadan o'chirish
```

---

## 🚢 Deploy

### Frontend → Vercel

```bash
# 1. Vercel CLI o'rnatish
npm i -g vercel

# 2. Deploy
cd frontend && vercel

# 3. Environment variables Vercel dashboard'da sozlash:
#    NEXT_PUBLIC_API_URL = https://your-backend.up.railway.app/api
```

### Backend → Railway

```bash
# 1. Railway CLI o'rnatish
npm i -g @railway/cli

# 2. Login + deploy
cd backend
railway login
railway init
railway up

# 3. Environment variables Railway dashboard'da:
#    NODE_ENV, PORT, MONGODB_URI, JWT_SECRET,
#    JWT_REFRESH_SECRET, ANTHROPIC_API_KEY, FRONTEND_URL
```

### MongoDB Atlas (baza)

```
1. atlas.mongodb.com → Create Cluster (M0 free tier)
2. Database Access → Add User
3. Network Access → Allow from anywhere (0.0.0.0/0)
4. Connect → Copy connection string → MONGODB_URI
```

---

## 🔑 Mentor uchun: AI Funksiyalarni Sinash

> **Muhim:** AI funksiyalari ishlashi uchun `ANTHROPIC_API_KEY` talab qilinadi.

```bash
# API kalitini olish: https://console.anthropic.com/
# Bepul tier: $5 kredit (ko'plab test uchun yetarli)

# backend/.env fayliga qo'shish:
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxx

# Test qilish:
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Samarqand haqida ayt"}]}'
```

**AI funksiyalarsiz ham ilova ishlaydi** — statik ma'lumotlar (8 joy, sharhlar, xizmatlar) to'liq ko'rinadi.

---

## 📦 Skriptlar

```bash
# Root (monorepo)
npm run dev           # Frontend + Backend parallel
npm run dev:frontend  # Faqat frontend (port 3000)
npm run dev:backend   # Faqat backend (port 5000)
npm run build         # Ikkalasini build qilish

# Frontend
npm run dev           # Ishlab chiqish serveri
npm run build         # Production build
npm run lint          # ESLint tekshirish

# Backend
npm run dev           # ts-node-dev (hot reload)
npm run build         # TypeScript → JavaScript
npm run start         # Production (dist/server.js)
```

---

## 👥 Jamoa

| Rol                  | Texnologiya                                 |
|----------------------|---------------------------------------------|
| Frontend Developer   | Next.js, React, TypeScript, Tailwind CSS    |
| Backend Developer    | Node.js, Express, MongoDB, TypeScript       |
| AI Integration       | Anthropic Claude API, Prompt Engineering    |
| UI/UX Designer       | shadcn/ui, Radix UI, CSS Animations         |

---

## 📄 Litsenziya

[MIT](LICENSE) © 2026 MRTOUR.UZ

---

<div align="center">
  <strong>🇺🇿 O'zbekistonni dunyo bilan tanishtirish</strong><br/>
  Made with ❤️ and Claude AI
</div>
