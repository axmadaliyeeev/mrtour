import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Landmark, HeartHandshake, UtensilsCrossed, ShieldCheck,
  Users, MapPin, Languages, Banknote, Bus, FileCheck,
  Sun, Snowflake, Flower2, Leaf, ChevronRight, Bot, Globe2,
  Shirt, HandCoins, MessageCircleHeart, Camera,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CountrySwitcher } from "@/components/shared/CountrySwitcher";
import { useTranslation } from "@/i18n";
import type { Lang } from "@/i18n";
import { useInView } from "@/hooks/useInView";
import registanImg from "@/data/registan.jpg";
import arkQalasiImg from "@/data/ark-qalasi.avif";
import ichanQalaImg from "@/data/ichan-qala.jpg";
import chorsuImg from "@/data/chorsu-rinok.jpg";
import chimganImg from "@/data/chimgan-toglari.jpeg";

// ── Reusable animated section wrapper (same pattern as Home.tsx) ──────
function Section({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn(className, "transition-none", inView ? "animate-fade-up" : "opacity-0")}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ── Per-language content ───────────────────────────────────────────────
// Kept out of the shared i18n schema (which is meant for short UI chrome
// strings) — this is page-specific long-form content, following the same
// pattern Chat.tsx already uses for locale-keyed data (LOCALE_MAP).
interface UzContent {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  facts: { label: string; value: string }[];
  whyTitle: string;
  whySubtitle: string;
  why: { title: string; desc: string }[];
  regionsTitle: string;
  regionsSubtitle: string;
  regions: { name: string; desc: string }[];
  tipsTitle: string;
  tipsSubtitle: string;
  tips: { title: string; desc: string }[];
  etiquetteTitle: string;
  etiquetteSubtitle: string;
  etiquette: { title: string; desc: string }[];
  seasonsTitle: string;
  seasons: { title: string; desc: string }[];
  ctaTitle: string;
  ctaDesc: string;
  ctaExplore: string;
  ctaAi: string;
}

const WHY_ICONS = [Landmark, HeartHandshake, UtensilsCrossed, ShieldCheck];
const TIP_ICONS = [FileCheck, Banknote, Bus, Languages];
const ETIQUETTE_ICONS = [Shirt, HandCoins, MessageCircleHeart, Camera];
const SEASON_ICONS = [Flower2, Sun, Leaf, Snowflake];
const REGION_IMAGES = [registanImg, arkQalasiImg, ichanQalaImg, chorsuImg, chimganImg];
// Data-layer city names (as stored in LOCATIONS), aligned by index with
// c.regions, whose display names are localized. This is what lets a region
// card deep-link to /locations?city=… — the cards used to dump visitors on
// the unfiltered list even though the filter deep-link already existed and
// the map right above them uses it.
const REGION_CITIES = ["Samarqand", "Buxoro", "Xiva", "Toshkent", "Chimgan"];

const CONTENT: Record<Lang, UzContent> = {
  uz: {
    heroBadge: "Birinchi marta kelyapsizmi?",
    heroTitle: "O'zbekiston haqida",
    heroSubtitle:
      "Buyuk Ipak yo'lining yuragi — 2700 yillik tarix, samimiy mehmondo'stlik va zamonaviy shaharlar bir joyda. Sayohatingizni boshlashdan oldin bilishingiz kerak bo'lgan hammasi shu yerda.",
    facts: [
      { label: "Poytaxt", value: "Toshkent" },
      { label: "Aholi", value: "~36 million" },
      { label: "Til", value: "O'zbek, Rus" },
      { label: "Valyuta", value: "So'm (UZS)" },
      { label: "Vaqt zonasi", value: "UTC+5" },
      { label: "Eng yaxshi mavsum", value: "Mart–May, Sen–Noy" },
    ],
    whyTitle: "Nega aynan O'zbekiston?",
    whySubtitle: "To'rtta sabab — birinchi sayohatingizni unutilmas qiladi",
    why: [
      { title: "2700 yillik tarix", desc: "Samarqand, Buxoro va Xiva — UNESCO Jahon merosi ro'yxatidagi qadimiy shaharlar, har bir tosh o'z hikoyasini aytadi." },
      { title: "Samimiy mehmondo'stlik", desc: "\"Mehmon — otadan ulug'\" — mahalliy oilalar bilan yaqinlashish, chaqirilmagan ham bo'lsangiz, dasturxonga taklif etilasiz." },
      { title: "Boy milliy taomlar", desc: "Osh, shashlik, somsa va issiq non — har bir viloyatning o'z retsepti bor, hammasini tatib ko'rish o'zi bir sayohat." },
      { title: "Xavfsiz va qulay", desc: "Markaziy Osiyoning eng xavfsiz mamlakatlaridan biri — ko'p millatlar uchun 30 kungacha vizasiz kirish imkoniyati." },
    ],
    regionsTitle: "Qayerdan boshlash kerak",
    regionsSubtitle: "Beshta mintaqa — beshta boshqa dunyo",
    regions: [
      { name: "Samarqand", desc: "Registon maydoni va Amir Temur merosi — Ipak yo'lining marvaridi." },
      { name: "Buxoro", desc: "1000 yildan ortiq tarixi saqlanib qolgan ochiq osmon ostidagi muzey shahar." },
      { name: "Xiva", desc: "Ichan-Qal'a — devorlar bilan o'ralgan, vaqtda muzlab qolgan qadimiy shahar." },
      { name: "Toshkent", desc: "Zamonaviy poytaxt — Chorsu bozori, metro san'ati va tungi hayot." },
      { name: "Chimgan tog'lari", desc: "Toshkentdan bir soatlik masofada — tog' havosi, treking va qish sportlari." },
    ],
    tipsTitle: "Amaliy maslahatlar",
    tipsSubtitle: "Sayohatga tayyorgarlik ko'rishda yordam beradigan asosiy narsalar",
    tips: [
      { title: "Viza", desc: "90 dan ortiq davlat fuqarolari uchun 30 kungacha vizasiz kirish mumkin. Oldindan e-visa.gov.uz saytida tekshiring." },
      { title: "Pul almashtirish", desc: "So'm — asosiy valyuta. Bank yoki rasmiy almashtirish shoxobchalaridan foydalaning, karta ko'p joyda qabul qilinadi." },
      { title: "Transport", desc: "Shaharlararo tezyurar poyezd (Afrosiyob) qulay va tez. Shahar ichida taksi ilovalari (Yandex Go) keng tarqalgan." },
      { title: "Til", desc: "O'zbek va rus tillari asosiy. Turistik joylarda ingliz tilida so'zlashuvchilarni topish mumkin, Trova AI ham yordam beradi." },
    ],
    etiquetteTitle: "Madaniy odob-axloq",
    etiquetteSubtitle: "Mahalliy an'analarni hurmat qilish uchun kichik maslahatlar",
    etiquette: [
      { title: "Diniy joylarda kiyinish", desc: "Machit va maqbaralarga kirishda yelka va tizzalar yopiq bo'lishi kerak, ayollar ro'mol olib yurishi tavsiya etiladi." },
      { title: "Choy pul (tip)", desc: "Restoranlarda 10% atrofida choy pul odatiy holat, lekin majburiy emas — hisobga qo'shilmagan bo'lsa qoldirish yaxshi odat." },
      { title: "Salomlashish", desc: "\"Assalomu alaykum\" — eng keng tarqalgan salom. Katta yoshdagilarga ikki qo'l bilan qo'l berish hurmat belgisi." },
      { title: "Suratga olish", desc: "Odamlarni, ayniqsa ayollarni suratga olishdan oldin ruxsat so'rang — ko'pchilik mamnuniyat bilan rozi bo'ladi." },
    ],
    seasonsTitle: "Yilning qaysi faslida borish kerak",
    seasons: [
      { title: "Bahor (Mar–May)", desc: "Eng yaxshi mavsum — iliq, gullar ochilgan, sayohat uchun ideal harorat." },
      { title: "Yoz (Iyun–Avg)", desc: "Issiq va quruq (40°C gacha) — ertalab/kechqurun sayohat qilish tavsiya etiladi." },
      { title: "Kuz (Sen–Noy)", desc: "Bahordan keyingi eng yaxshi mavsum — mo''tadil harorat, uzum va meva mavsumi." },
      { title: "Qish (Dek–Fev)", desc: "Salqin (0–10°C) — Chimgan kabi tog' hududlarida qish sporti mavsumi." },
    ],
    ctaTitle: "Sayohatga tayyormisiz?",
    ctaDesc: "200+ joy va Trova AI yordamchisi bilan o'zingizga mos marshrutni bir necha daqiqada tuzing.",
    ctaExplore: "Joylarni ko'rish",
    ctaAi: "AI bilan reja tuzish",
  },
  ru: {
    heroBadge: "Впервые в Узбекистане?",
    heroTitle: "Об Узбекистане",
    heroSubtitle:
      "Сердце Великого Шёлкового пути — 2700 лет истории, искреннее гостеприимство и современные города в одном месте. Всё, что нужно знать перед началом путешествия.",
    facts: [
      { label: "Столица", value: "Ташкент" },
      { label: "Население", value: "~36 млн" },
      { label: "Язык", value: "Узбекский, русский" },
      { label: "Валюта", value: "Сум (UZS)" },
      { label: "Часовой пояс", value: "UTC+5" },
      { label: "Лучший сезон", value: "Март–Май, Сен–Ноя" },
    ],
    whyTitle: "Почему именно Узбекистан?",
    whySubtitle: "Четыре причины, которые сделают первую поездку незабываемой",
    why: [
      { title: "2700 лет истории", desc: "Самарканд, Бухара и Хива — древние города из списка Всемирного наследия ЮНЕСКО, где каждый камень хранит свою историю." },
      { title: "Искреннее гостеприимство", desc: "«Гость дороже отца» — местные семьи с радостью примут вас за дастархан, даже без приглашения." },
      { title: "Богатая национальная кухня", desc: "Плов, шашлык, самса и свежий хлеб — в каждом регионе свой рецепт, попробовать всё — уже само по себе путешествие." },
      { title: "Безопасно и удобно", desc: "Одна из самых безопасных стран Центральной Азии — безвизовый въезд до 30 дней для многих стран." },
    ],
    regionsTitle: "С чего начать",
    regionsSubtitle: "Пять регионов — пять разных миров",
    regions: [
      { name: "Самарканд", desc: "Площадь Регистан и наследие Амира Тимура — жемчужина Шёлкового пути." },
      { name: "Бухара", desc: "Город-музей под открытым небом с более чем тысячелетней историей." },
      { name: "Хива", desc: "Ичан-Кала — древний город за крепостными стенами, застывший во времени." },
      { name: "Ташкент", desc: "Современная столица — базар Чорсу, искусство метро и ночная жизнь." },
      { name: "Горы Чимган", desc: "В часе езды от Ташкента — горный воздух, треккинг и зимние виды спорта." },
    ],
    tipsTitle: "Практические советы",
    tipsSubtitle: "Главное для подготовки к поездке",
    tips: [
      { title: "Виза", desc: "Для граждан 90+ стран — безвизовый въезд до 30 дней. Проверьте заранее на e-visa.gov.uz." },
      { title: "Обмен валюты", desc: "Сум — основная валюта. Используйте банки или официальные пункты обмена, карты принимают во многих местах." },
      { title: "Транспорт", desc: "Скоростной поезд «Afrosiyob» между городами удобен и быстр. В городе популярны такси-приложения (Yandex Go)." },
      { title: "Язык", desc: "Основные языки — узбекский и русский. В туристических местах часто говорят по-английски, а Trova AI всегда поможет." },
    ],
    etiquetteTitle: "Культурный этикет",
    etiquetteSubtitle: "Небольшие советы для уважения местных традиций",
    etiquette: [
      { title: "Одежда в религиозных местах", desc: "При посещении мечетей и мавзолеев плечи и колени должны быть закрыты, женщинам рекомендуется иметь платок." },
      { title: "Чаевые", desc: "В ресторанах обычны чаевые около 10%, но необязательны — если не включены в счёт, оставить их будет уместно." },
      { title: "Приветствие", desc: "«Ассалому алейкум» — самое распространённое приветствие. Пожатие обеими руками — знак уважения к старшим." },
      { title: "Фотосъёмка", desc: "Прежде чем фотографировать людей, особенно женщин, спросите разрешения — большинство охотно соглашается." },
    ],
    seasonsTitle: "Когда лучше ехать",
    seasons: [
      { title: "Весна (Мар–Май)", desc: "Лучший сезон — тепло, цветение, идеальная температура для путешествий." },
      { title: "Лето (Июн–Авг)", desc: "Жарко и сухо (до 40°C) — рекомендуются экскурсии утром и вечером." },
      { title: "Осень (Сен–Ноя)", desc: "Второй по популярности сезон — мягкая температура, сезон винограда и фруктов." },
      { title: "Зима (Дек–Фев)", desc: "Прохладно (0–10°C) — в горных районах вроде Чимгана начинается сезон зимних видов спорта." },
    ],
    ctaTitle: "Готовы к путешествию?",
    ctaDesc: "200+ мест и помощник Trova AI помогут составить идеальный маршрут за несколько минут.",
    ctaExplore: "Смотреть места",
    ctaAi: "Составить план с AI",
  },
  en: {
    heroBadge: "First time in Uzbekistan?",
    heroTitle: "About Uzbekistan",
    heroSubtitle:
      "The heart of the Silk Road — 2,700 years of history, genuine hospitality and modern cities in one place. Everything worth knowing before you start planning your trip.",
    facts: [
      { label: "Capital", value: "Tashkent" },
      { label: "Population", value: "~36 million" },
      { label: "Language", value: "Uzbek, Russian" },
      { label: "Currency", value: "Som (UZS)" },
      { label: "Timezone", value: "UTC+5" },
      { label: "Best season", value: "Mar–May, Sep–Nov" },
    ],
    whyTitle: "Why Uzbekistan?",
    whySubtitle: "Four reasons your first trip will be unforgettable",
    why: [
      { title: "2,700 years of history", desc: "Samarkand, Bukhara and Khiva — UNESCO World Heritage cities where every stone has a story to tell." },
      { title: "Genuine hospitality", desc: "\"A guest is greater than a father\" — local families will welcome you to their table, invited or not." },
      { title: "Rich national cuisine", desc: "Plov, shashlik, somsa and fresh bread — every region has its own recipe; tasting them all is a trip in itself." },
      { title: "Safe and convenient", desc: "One of the safest countries in Central Asia, with visa-free entry of up to 30 days for many nationalities." },
    ],
    regionsTitle: "Where to start",
    regionsSubtitle: "Five regions, five different worlds",
    regions: [
      { name: "Samarkand", desc: "Registan Square and the legacy of Amir Timur — the pearl of the Silk Road." },
      { name: "Bukhara", desc: "An open-air museum city with more than a thousand years of preserved history." },
      { name: "Khiva", desc: "Ichan-Qala — a walled ancient city that feels frozen in time." },
      { name: "Tashkent", desc: "The modern capital — Chorsu bazaar, metro art and vibrant nightlife." },
      { name: "Chimgan Mountains", desc: "An hour from Tashkent — mountain air, trekking and winter sports." },
    ],
    tipsTitle: "Practical tips",
    tipsSubtitle: "The essentials for planning your trip",
    tips: [
      { title: "Visa", desc: "Citizens of 90+ countries can enter visa-free for up to 30 days. Check e-visa.gov.uz in advance." },
      { title: "Currency exchange", desc: "The Som is the main currency. Use banks or official exchange points; cards are accepted in most places." },
      { title: "Transport", desc: "The Afrosiyob high-speed train between cities is fast and comfortable. Taxi apps (Yandex Go) are common in cities." },
      { title: "Language", desc: "Uzbek and Russian are the main languages. English is common at tourist sites, and Trova AI is always there to help." },
    ],
    etiquetteTitle: "Cultural etiquette",
    etiquetteSubtitle: "A few tips for respecting local traditions",
    etiquette: [
      { title: "Dress at religious sites", desc: "Shoulders and knees should be covered when visiting mosques and mausoleums; women may want to carry a headscarf." },
      { title: "Tipping", desc: "Around 10% is customary at restaurants but not mandatory — leaving it is a nice gesture if it isn't already included in the bill." },
      { title: "Greetings", desc: "\"Assalomu alaykum\" is the most common greeting. A two-handed handshake is a sign of respect toward elders." },
      { title: "Photography", desc: "Ask permission before photographing people, especially women — most are happy to say yes." },
    ],
    seasonsTitle: "The best time to visit",
    seasons: [
      { title: "Spring (Mar–May)", desc: "The best season — warm, blooming, ideal travel temperatures." },
      { title: "Summer (Jun–Aug)", desc: "Hot and dry (up to 40°C) — mornings and evenings are best for sightseeing." },
      { title: "Autumn (Sep–Nov)", desc: "A close second — mild temperatures, and grape and fruit season." },
      { title: "Winter (Dec–Feb)", desc: "Cool (0–10°C) — mountain areas like Chimgan open for winter sports." },
    ],
    ctaTitle: "Ready to explore?",
    ctaDesc: "200+ places and the Trova AI assistant help you build the perfect route in minutes.",
    ctaExplore: "Browse places",
    ctaAi: "Plan with AI",
  },
  zh: {
    heroBadge: "第一次来乌兹别克斯坦？",
    heroTitle: "关于乌兹别克斯坦",
    heroSubtitle: "丝绸之路的心脏地带——2700年历史、真诚的待客之道与现代都市融为一体。出发前你需要了解的一切都在这里。",
    facts: [
      { label: "首都", value: "塔什干" },
      { label: "人口", value: "约3600万" },
      { label: "语言", value: "乌兹别克语、俄语" },
      { label: "货币", value: "苏姆 (UZS)" },
      { label: "时区", value: "UTC+5" },
      { label: "最佳季节", value: "3–5月，9–11月" },
    ],
    whyTitle: "为什么选择乌兹别克斯坦？",
    whySubtitle: "四个理由，让你的第一次旅行难以忘怀",
    why: [
      { title: "2700年历史", desc: "撒马尔罕、布哈拉与希瓦——联合国教科文组织世界遗产古城，每一块石头都在讲述故事。" },
      { title: "真诚好客", desc: "「客人比父亲更尊贵」——即使未被邀请，当地家庭也会热情款待你。" },
      { title: "丰富的民族美食", desc: "抓饭、烤肉串、萨姆萨与新鲜面包——每个地区都有自己的做法，尝遍全部本身就是一次旅行。" },
      { title: "安全便利", desc: "中亚最安全的国家之一，许多国家公民可享受最长30天免签入境。" },
    ],
    regionsTitle: "从哪里开始",
    regionsSubtitle: "五个地区，五个不同的世界",
    regions: [
      { name: "撒马尔罕", desc: "列吉斯坦广场与帖木儿的遗产——丝绸之路上的明珠。" },
      { name: "布哈拉", desc: "拥有千年历史的露天博物馆之城。" },
      { name: "希瓦", desc: "伊钦卡拉——被城墙环绕、仿佛时间静止的古城。" },
      { name: "塔什干", desc: "现代化首都——恰尔苏市场、地铁艺术与夜生活。" },
      { name: "奇姆干山", desc: "距塔什干仅一小时车程——山间空气、徒步与冬季运动。" },
    ],
    tipsTitle: "实用建议",
    tipsSubtitle: "行前准备的关键要点",
    tips: [
      { title: "签证", desc: "90多个国家的公民可享受最长30天免签入境，请提前在 e-visa.gov.uz 查询。" },
      { title: "货币兑换", desc: "苏姆是主要货币，请使用银行或官方兑换点，多数场所可刷卡。" },
      { title: "交通", desc: "城际高铁「Afrosiyob」快捷舒适，市内打车软件（Yandex Go）非常普及。" },
      { title: "语言", desc: "乌兹别克语和俄语为主要语言，旅游景点常见英语交流，Trova AI 也随时提供帮助。" },
    ],
    etiquetteTitle: "文化礼仪",
    etiquetteSubtitle: "尊重当地传统的几点小建议",
    etiquette: [
      { title: "宗教场所着装", desc: "参观清真寺和陵墓时应遮住肩膀和膝盖，女性建议随身携带头巾。" },
      { title: "小费", desc: "餐厅通常给约10%小费，但并非强制——如果账单未包含服务费，留下小费是不错的礼节。" },
      { title: "问候方式", desc: "「Assalomu alaykum」是最常见的问候语，双手握手是对长辈表示尊重的方式。" },
      { title: "拍照礼仪", desc: "拍摄他人，尤其是女性之前，请先征得同意——大多数人都会欣然同意。" },
    ],
    seasonsTitle: "最佳旅行季节",
    seasons: [
      { title: "春季 (3–5月)", desc: "最佳季节——温暖、繁花盛开，气温非常适合出行。" },
      { title: "夏季 (6–8月)", desc: "炎热干燥（最高40°C）——建议在早晚时段游览。" },
      { title: "秋季 (9–11月)", desc: "同样宜人——气温温和，正值葡萄与水果丰收季。" },
      { title: "冬季 (12–2月)", desc: "凉爽（0–10°C）——奇姆干等山区迎来冬季运动季节。" },
    ],
    ctaTitle: "准备好出发了吗？",
    ctaDesc: "200多个景点，加上 Trova AI 助手，几分钟即可规划出完美路线。",
    ctaExplore: "浏览景点",
    ctaAi: "使用 AI 规划",
  },
  de: {
    heroBadge: "Zum ersten Mal in Usbekistan?",
    heroTitle: "Über Usbekistan",
    heroSubtitle:
      "Das Herz der Seidenstraße — 2.700 Jahre Geschichte, herzliche Gastfreundschaft und moderne Städte an einem Ort. Alles Wichtige, bevor Sie Ihre Reise planen.",
    facts: [
      { label: "Hauptstadt", value: "Taschkent" },
      { label: "Bevölkerung", value: "~36 Mio." },
      { label: "Sprache", value: "Usbekisch, Russisch" },
      { label: "Währung", value: "Som (UZS)" },
      { label: "Zeitzone", value: "UTC+5" },
      { label: "Beste Reisezeit", value: "März–Mai, Sep–Nov" },
    ],
    whyTitle: "Warum Usbekistan?",
    whySubtitle: "Vier Gründe, warum Ihre erste Reise unvergesslich wird",
    why: [
      { title: "2.700 Jahre Geschichte", desc: "Samarkand, Buchara und Chiwa — UNESCO-Weltkulturerbestädte, in denen jeder Stein eine Geschichte erzählt." },
      { title: "Herzliche Gastfreundschaft", desc: "„Ein Gast ist mehr wert als ein Vater\" — Familien laden Sie gerne an ihren Tisch, auch ungefragt." },
      { title: "Reiche Küche", desc: "Plov, Schaschlik, Somsa und frisches Brot — jede Region hat ihr eigenes Rezept; alles zu probieren ist selbst schon eine Reise." },
      { title: "Sicher und unkompliziert", desc: "Eines der sichersten Länder Zentralasiens, mit visumfreier Einreise für bis zu 30 Tage für viele Nationalitäten." },
    ],
    regionsTitle: "Wo Sie beginnen sollten",
    regionsSubtitle: "Fünf Regionen, fünf verschiedene Welten",
    regions: [
      { name: "Samarkand", desc: "Der Registan-Platz und das Erbe Amir Timurs — die Perle der Seidenstraße." },
      { name: "Buchara", desc: "Eine Freilichtmuseumsstadt mit über tausend Jahren erhaltener Geschichte." },
      { name: "Chiwa", desc: "Itchan Kala — eine von Mauern umgebene Altstadt, die die Zeit zu vergessen scheint." },
      { name: "Taschkent", desc: "Die moderne Hauptstadt — Chorsu-Basar, Metro-Kunst und lebendiges Nachtleben." },
      { name: "Tschimgan-Berge", desc: "Eine Stunde von Taschkent entfernt — Bergluft, Trekking und Wintersport." },
    ],
    tipsTitle: "Praktische Tipps",
    tipsSubtitle: "Das Wichtigste für Ihre Reiseplanung",
    tips: [
      { title: "Visum", desc: "Staatsangehörige von über 90 Ländern reisen bis zu 30 Tage visumfrei ein. Prüfen Sie vorab e-visa.gov.uz." },
      { title: "Geldwechsel", desc: "Der Som ist die Landeswährung. Nutzen Sie Banken oder offizielle Wechselstellen; Karten werden vielerorts akzeptiert." },
      { title: "Transport", desc: "Der Hochgeschwindigkeitszug „Afrosiyob\" zwischen den Städten ist schnell und bequem. Taxi-Apps (Yandex Go) sind in Städten verbreitet." },
      { title: "Sprache", desc: "Usbekisch und Russisch sind die Hauptsprachen. An touristischen Orten wird oft Englisch gesprochen, und Trova AI hilft jederzeit." },
    ],
    etiquetteTitle: "Kultureller Knigge",
    etiquetteSubtitle: "Ein paar Tipps zum Respekt lokaler Traditionen",
    etiquette: [
      { title: "Kleidung an religiösen Stätten", desc: "Beim Besuch von Moscheen und Mausoleen sollten Schultern und Knie bedeckt sein; Frauen sollten ein Kopftuch dabeihaben." },
      { title: "Trinkgeld", desc: "In Restaurants sind etwa 10% üblich, aber nicht verpflichtend — sinnvoll, wenn es nicht bereits in der Rechnung enthalten ist." },
      { title: "Begrüßung", desc: "„Assalomu alaykum\" ist die gebräuchlichste Begrüßung. Ein beidhändiger Handschlag zeigt Respekt gegenüber Älteren." },
      { title: "Fotografieren", desc: "Fragen Sie um Erlaubnis, bevor Sie Menschen fotografieren, besonders Frauen — die meisten stimmen gerne zu." },
    ],
    seasonsTitle: "Die beste Reisezeit",
    seasons: [
      { title: "Frühling (Mär–Mai)", desc: "Die beste Saison — warm, blühend, ideale Reisetemperaturen." },
      { title: "Sommer (Jun–Aug)", desc: "Heiß und trocken (bis 40°C) — Besichtigungen morgens und abends empfohlen." },
      { title: "Herbst (Sep–Nov)", desc: "Fast ebenso gut — mildes Klima, Trauben- und Obsternte." },
      { title: "Winter (Dez–Feb)", desc: "Kühl (0–10°C) — Bergregionen wie Chimgan eröffnen die Wintersportsaison." },
    ],
    ctaTitle: "Bereit für Ihre Reise?",
    ctaDesc: "200+ Orte und der Trova-AI-Assistent helfen Ihnen, in wenigen Minuten die perfekte Route zu planen.",
    ctaExplore: "Orte entdecken",
    ctaAi: "Mit KI planen",
  },
  fr: {
    heroBadge: "Première visite en Ouzbékistan ?",
    heroTitle: "À propos de l'Ouzbékistan",
    heroSubtitle:
      "Le cœur de la Route de la Soie — 2 700 ans d'histoire, une hospitalité sincère et des villes modernes réunis en un seul endroit. Tout ce qu'il faut savoir avant de planifier votre voyage.",
    facts: [
      { label: "Capitale", value: "Tachkent" },
      { label: "Population", value: "~36 millions" },
      { label: "Langue", value: "Ouzbek, russe" },
      { label: "Monnaie", value: "Som (UZS)" },
      { label: "Fuseau horaire", value: "UTC+5" },
      { label: "Meilleure saison", value: "Mars–Mai, Sep–Nov" },
    ],
    whyTitle: "Pourquoi l'Ouzbékistan ?",
    whySubtitle: "Quatre raisons qui rendront votre premier voyage inoubliable",
    why: [
      { title: "2 700 ans d'histoire", desc: "Samarcande, Boukhara et Khiva — villes classées au patrimoine mondial de l'UNESCO, où chaque pierre raconte une histoire." },
      { title: "Hospitalité sincère", desc: "« Un invité vaut plus qu'un père » — les familles locales vous accueilleront à leur table, invité ou non." },
      { title: "Une cuisine riche", desc: "Plov, chachlik, somsa et pain frais — chaque région a sa propre recette ; tout goûter est déjà un voyage en soi." },
      { title: "Sûr et pratique", desc: "L'un des pays les plus sûrs d'Asie centrale, avec une entrée sans visa jusqu'à 30 jours pour de nombreuses nationalités." },
    ],
    regionsTitle: "Par où commencer",
    regionsSubtitle: "Cinq régions, cinq mondes différents",
    regions: [
      { name: "Samarcande", desc: "La place du Registan et l'héritage d'Amir Timour — la perle de la Route de la Soie." },
      { name: "Boukhara", desc: "Une ville-musée à ciel ouvert forte de plus de mille ans d'histoire préservée." },
      { name: "Khiva", desc: "Itchan-Kala — une cité ancienne fortifiée, comme figée dans le temps." },
      { name: "Tachkent", desc: "La capitale moderne — le bazar de Chorsu, l'art du métro et une vie nocturne animée." },
      { name: "Monts Tchimgan", desc: "À une heure de Tachkent — air pur, randonnée et sports d'hiver." },
    ],
    tipsTitle: "Conseils pratiques",
    tipsSubtitle: "L'essentiel pour préparer votre voyage",
    tips: [
      { title: "Visa", desc: "Les ressortissants de plus de 90 pays peuvent entrer sans visa jusqu'à 30 jours. Vérifiez au préalable sur e-visa.gov.uz." },
      { title: "Change de devises", desc: "Le som est la monnaie principale. Utilisez les banques ou les bureaux de change officiels ; les cartes sont acceptées presque partout." },
      { title: "Transport", desc: "Le train à grande vitesse Afrosiyob entre les villes est rapide et confortable. Les applications de taxi (Yandex Go) sont courantes en ville." },
      { title: "Langue", desc: "L'ouzbek et le russe sont les langues principales. L'anglais est courant sur les sites touristiques, et Trova AI est toujours là pour aider." },
    ],
    etiquetteTitle: "Étiquette culturelle",
    etiquetteSubtitle: "Quelques conseils pour respecter les traditions locales",
    etiquette: [
      { title: "Tenue dans les lieux religieux", desc: "Épaules et genoux doivent être couverts dans les mosquées et mausolées ; les femmes peuvent prévoir un foulard." },
      { title: "Pourboire", desc: "Environ 10% est courant dans les restaurants mais non obligatoire — un geste apprécié s'il n'est pas déjà inclus dans l'addition." },
      { title: "Salutations", desc: "« Assalomu alaykum » est la salutation la plus courante. Une poignée de main à deux mains marque le respect envers les aînés." },
      { title: "Photographie", desc: "Demandez la permission avant de photographier des personnes, surtout des femmes — la plupart acceptent volontiers." },
    ],
    seasonsTitle: "La meilleure période pour visiter",
    seasons: [
      { title: "Printemps (Mar–Mai)", desc: "La meilleure saison — doux, fleuri, des températures idéales pour voyager." },
      { title: "Été (Juin–Août)", desc: "Chaud et sec (jusqu'à 40°C) — les visites sont préférables le matin et le soir." },
      { title: "Automne (Sep–Nov)", desc: "Presque aussi agréable — températures douces, saison des raisins et des fruits." },
      { title: "Hiver (Déc–Fév)", desc: "Frais (0–10°C) — les régions montagneuses comme Tchimgan ouvrent la saison des sports d'hiver." },
    ],
    ctaTitle: "Prêt à explorer ?",
    ctaDesc: "200+ lieux et l'assistant Trova AI vous aident à créer l'itinéraire parfait en quelques minutes.",
    ctaExplore: "Explorer les lieux",
    ctaAi: "Planifier avec l'IA",
  },
};

// Four largest cities, positioned on a simplified silhouette of the
// country (not geographically precise — a stylized diagram, in the same
// spirit as subway-map city dots, not a GIS map). Clicking a marker jumps
// straight to that city's locations instead of leaving the visitor to
// find the filter themselves.
const MAP_CITIES = [
  { name: "Toshkent",  x: 74, y: 22 },
  { name: "Samarqand", x: 46, y: 46 },
  { name: "Buxoro",    x: 24, y: 52 },
  { name: "Xiva",      x: 10, y: 40 },
];

// Short "not to scale" caption — visitors otherwise have no way to know
// the outline above is a stylized diagram rather than an accurate map.
const MAP_NOTE: Record<Lang, string> = {
  uz: "Sxematik tasvir, geografik jihatdan aniq emas",
  ru: "Схематичное изображение, не является точной картой",
  en: "Schematic illustration, not to scale",
  zh: "示意图，非精确地图",
  de: "Schematische Darstellung, nicht maßstabsgetreu",
  fr: "Illustration schématique, pas à l'échelle",
};

function RegionMap({ onPick, lang }: { onPick: (city: string) => void; lang: Lang }) {
  return (
    <div className="relative rounded-2xl bg-[var(--card)] border border-transparent shadow-[var(--shadow-card)] p-4 sm:p-6">
      <svg viewBox="0 0 100 70" className="w-full h-auto max-h-64" aria-hidden="true">
        {/* Loose, hand-drawn-feeling outline standing in for the country
            border — a mood-setting backdrop for the markers, not a
            literal atlas trace. */}
        <path
          d="M4 42C2 34 8 28 16 30C20 20 30 14 40 18C48 10 62 8 70 16C82 14 94 20 96 30C98 40 90 48 80 46C76 56 62 62 50 56C40 62 24 60 18 52C10 54 5 50 4 42Z"
          fill="var(--muted)"
          stroke="var(--border)"
          strokeWidth="0.6"
        />
        {MAP_CITIES.map((city) => (
          <g
            key={city.name}
            className="cursor-pointer"
            onClick={() => onPick(city.name)}
            role="button"
            tabIndex={0}
            aria-label={city.name}
            onKeyDown={(e) => {
              // Native/ARIA buttons activate on both Enter and Space —
              // this custom <g role="button"> only handled Enter, so
              // Space (the more common activation key for keyboard/switch
              // users) silently scrolled the page instead.
              if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                e.preventDefault();
                onPick(city.name);
              }
            }}
          >
            <circle cx={city.x} cy={city.y} r="5" fill="var(--primary)" opacity="0.15">
              <animate attributeName="r" values="5;7;5" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.15;0;0.15" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <circle cx={city.x} cy={city.y} r="2.4" fill="var(--primary)" stroke="var(--background)" strokeWidth="0.8" />
            <text
              x={city.x}
              y={city.y - 5}
              textAnchor="middle"
              fontSize="4.2"
              fontWeight="700"
              fill="var(--foreground)"
              className="select-none"
            >
              {city.name}
            </text>
          </g>
        ))}
      </svg>
      <p className="text-[10px] text-[var(--muted-foreground)]/70 text-center mt-1">
        {MAP_NOTE[lang]}
      </p>
    </div>
  );
}

// The recurring brand S-curve, drawn once as a long "journey line" that
// threads through the five region cards — a signature layout moment
// unique to this page instead of reusing the generic grid pattern.
function JourneyCurve() {
  return (
    <svg
      className="hidden md:block absolute left-0 top-0 w-full h-full pointer-events-none"
      viewBox="0 0 1000 420" fill="none" preserveAspectRatio="none" aria-hidden="true"
    >
      <motion.path
        d="M60 60C260 60 220 200 420 200C620 200 580 60 780 60C880 60 900 140 940 200"
        stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 10"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.4 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}

export default function Uzbekistan() {
  const navigate = useNavigate();
  const { lang } = useTranslation();
  // CONTENT is keyed by the same Lang union as everywhere else, so this
  // fallback should be unreachable — but if a future language is added to
  // Lang without a matching CONTENT entry, silently rendering Uzbek copy
  // for that language's users would be a much harder regression to catch
  // than a console warning during development.
  if (import.meta.env.DEV && !CONTENT[lang]) {
    console.warn(`Uzbekistan.tsx: no CONTENT entry for lang "${lang}", falling back to "uz"`);
  }
  const c = CONTENT[lang] ?? CONTENT.uz;

  return (
    <div className="pb-8">
      <CountrySwitcher />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="px-4 pt-4 pb-2">
        <div className="grain-overlay relative overflow-hidden rounded-3xl border border-[var(--border)] shadow-2xl shadow-black/10 h-[380px] sm:h-[440px] flex items-end">
          <img
            src={registanImg}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-[center_35%] opacity-90 dark:opacity-70"
          />
          {/* Was a flat 75%-opacity wash across the whole photo — that
              washed out the top two-thirds for no reason, since only the
              bottom (where the headline sits) actually needs legibility
              help. Concentrating the scrim there keeps the photo vivid
              up top and still gives the text a solid contrast base. */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] from-0% via-[var(--background)]/55 via-45% to-transparent to-80%" />
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#0f172a]/25 via-[#0f172a]/5 to-transparent dark:from-black/40 dark:via-black/10" />
          <div className="aurora-overlay absolute inset-0 opacity-40 pointer-events-none" />

          <div className="relative px-5 sm:px-8 pb-8 sm:pb-10 max-w-2xl">
            <div className="glint animate-fade-up inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-500 dark:text-indigo-400 text-xs font-semibold mb-4 backdrop-blur-sm">
              <Globe2 className="w-3.5 h-3.5" />
              {c.heroBadge}
            </div>
            <h1 className="animate-fade-up delay-75 text-3xl sm:text-5xl font-extrabold text-gradient leading-[1.05] pb-1 mb-3 tracking-tight">
              {c.heroTitle}
            </h1>
            <p className="animate-fade-up delay-150 text-[var(--muted-foreground)] text-sm sm:text-base leading-relaxed max-w-lg">
              {c.heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Route-curve divider — same signature as Home's hero->stats seam */}
      <div className="px-4 mt-4 mb-2 flex justify-center pointer-events-none" aria-hidden="true">
        <svg width="120" height="12" viewBox="0 0 120 12" fill="none">
          <motion.path
            d="M2 6C22 6 22 2 42 2C62 2 62 10 82 10C97 10 97 6 118 6"
            stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.85 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
      </div>

      {/* ── Quick facts ───────────────────────────────────────── */}
      <section className="px-4 mb-9">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {c.facts.map((f, i) => (
            <div
              key={f.label}
              className="tilt-hover animate-fade-up flex flex-col items-center gap-1 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] p-3.5 text-center"
              style={{ animationDelay: `${i * 60 + 100}ms` }}
            >
              <span className="text-sm font-bold text-[var(--foreground)]">{f.value}</span>
              <span className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wide">{f.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why Uzbekistan ────────────────────────────────────── */}
      <Section className="px-4 mb-10" delay={0}>
        <div className="mb-5 text-center max-w-lg mx-auto">
          <h2 className="reveal-wipe font-display text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-1.5">
            {c.whyTitle}
          </h2>
          <p className="text-sm text-[var(--muted-foreground)]">{c.whySubtitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {c.why.map((w, i) => {
            const Icon = WHY_ICONS[i % WHY_ICONS.length];
            return (
              <div
                key={w.title}
                className="tilt-hover animate-fade-up flex items-start gap-3.5 p-4 rounded-2xl bg-[var(--card)] border border-transparent shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)]"
                style={{ animationDelay: `${i * 70 + 100}ms` }}
              >
                <span className="w-11 h-11 shrink-0 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-indigo-500" strokeWidth={2} />
                </span>
                <div>
                  <p className="text-sm font-bold text-[var(--foreground)] mb-1">{w.title}</p>
                  <p className="text-[13px] text-[var(--muted-foreground)] leading-relaxed">{w.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ── Regions — the unique "journey line" layout moment ────── */}
      <Section className="px-4 mb-10" delay={0}>
        <div className="mb-5 text-center max-w-lg mx-auto">
          <h2 className="reveal-wipe font-display text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-1.5">
            {c.regionsTitle}
          </h2>
          <p className="text-sm text-[var(--muted-foreground)]">{c.regionsSubtitle}</p>
        </div>
        <div className="mb-4">
          <RegionMap lang={lang} onPick={(city) => navigate(`/locations?city=${encodeURIComponent(city)}`)} />
        </div>
        <div className="relative">
          <JourneyCurve />
          {/* Card treatment adapted from a 21st.dev DestinationCard prompt:
              a brand-tinted gradient instead of plain black, a glass
              "explore" row that reveals on hover, and an emerald hover
              glow. Its flag emoji are deliberately NOT carried over — on
              Windows without color-emoji fonts they render as bare letter
              pairs, the exact bug already purged from this codebase. */}
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {c.regions.map((r, i) => (
              <button
                key={r.name}
                onClick={() => navigate(`/locations?city=${encodeURIComponent(REGION_CITIES[i])}`)}
                className="animate-fade-up group relative h-64 rounded-2xl overflow-hidden text-left shadow-md transition-all duration-300 hover:shadow-xl hover:shadow-indigo-900/25 hover:-translate-y-1 shrink-0"
                style={{ animationDelay: `${i * 90 + 100}ms` }}
              >
                <img
                  src={REGION_IMAGES[i]}
                  alt={r.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-500 ease-out"
                  loading="lazy"
                  decoding="async"
                />
                {/* Brand-tinted scrim: deep emerald at the base so the card
                    reads as part of the palette, fading to clear so the
                    photo stays the subject. */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-900/35 to-transparent" />
                {/* Numbered waypoint marker — reinforces the "journey" framing */}
                <span className="absolute top-3 left-3 w-6 h-6 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-[11px] font-bold text-white">
                  {i + 1}
                </span>
                <div className="absolute bottom-0 left-0 right-0 p-3.5">
                  <h3 className="route-underline font-bold text-white text-sm leading-tight mb-1 drop-shadow-lg">
                    {r.name}
                  </h3>
                  <p className="text-[11px] text-white/80 leading-snug line-clamp-2">{r.desc}</p>
                  {/* Glass explore row — collapsed until hover so the grid
                      stays quiet at rest, then slides open as the click
                      affordance the old card never stated. */}
                  <span className="mt-2.5 grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-300">
                    <span className="overflow-hidden">
                      <span className="flex items-center justify-between rounded-lg px-3 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-[11px] font-semibold tracking-wide">{c.ctaExplore}</span>
                        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </span>
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Practical tips ────────────────────────────────────── */}
      <Section className="px-4 mb-10" delay={0}>
        <div className="mb-5 text-center max-w-lg mx-auto">
          <h2 className="reveal-wipe font-display text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-1.5">
            {c.tipsTitle}
          </h2>
          <p className="text-sm text-[var(--muted-foreground)]">{c.tipsSubtitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {c.tips.map((tip, i) => {
            const Icon = TIP_ICONS[i % TIP_ICONS.length];
            return (
              <div
                key={tip.title}
                className="animate-fade-up flex items-start gap-3 p-3.5 rounded-xl bg-[var(--card)] border border-transparent shadow-[var(--shadow-card)]"
                style={{ animationDelay: `${i * 60 + 100}ms` }}
              >
                <span className="w-9 h-9 shrink-0 rounded-lg bg-[var(--muted)] flex items-center justify-center">
                  <Icon className="w-4 h-4 text-indigo-500" strokeWidth={2} />
                </span>
                <div>
                  <p className="text-xs font-bold text-[var(--foreground)] mb-0.5">{tip.title}</p>
                  <p className="text-[12px] text-[var(--muted-foreground)] leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ── Cultural etiquette ───────────────────────────────────
          The one genuinely new content section here — visa/currency/
          transport/language were already covered by Practical Tips
          above, so this adds what wasn't there yet rather than
          duplicating it. */}
      <Section className="px-4 mb-10" delay={0}>
        <div className="mb-5 text-center max-w-lg mx-auto">
          <h2 className="reveal-wipe font-display text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-1.5">
            {c.etiquetteTitle}
          </h2>
          <p className="text-sm text-[var(--muted-foreground)]">{c.etiquetteSubtitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {c.etiquette.map((item, i) => {
            const Icon = ETIQUETTE_ICONS[i % ETIQUETTE_ICONS.length];
            return (
              <div
                key={item.title}
                className="tilt-hover animate-fade-up flex items-start gap-3.5 p-4 rounded-2xl bg-[var(--card)] border border-transparent shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)]"
                style={{ animationDelay: `${i * 70 + 100}ms` }}
              >
                <span className="w-11 h-11 shrink-0 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-indigo-500" strokeWidth={2} />
                </span>
                <div>
                  <p className="text-sm font-bold text-[var(--foreground)] mb-1">{item.title}</p>
                  <p className="text-[13px] text-[var(--muted-foreground)] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ── Best time to visit ────────────────────────────────── */}
      <Section className="px-4 mb-10" delay={0}>
        <h2 className="reveal-wipe font-display text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-5 text-center">
          {c.seasonsTitle}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {c.seasons.map((s, i) => {
            const Icon = SEASON_ICONS[i % SEASON_ICONS.length];
            return (
              <div
                key={s.title}
                className="tilt-hover animate-fade-up flex flex-col items-center text-center gap-2 p-4 rounded-2xl bg-[var(--card)] border border-transparent shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)]"
                style={{ animationDelay: `${i * 70 + 100}ms` }}
              >
                <span className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Icon className="w-4.5 h-4.5 text-indigo-500" strokeWidth={2} />
                </span>
                <p className="text-xs font-bold text-[var(--foreground)]">{s.title}</p>
                <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ── Closing CTA ───────────────────────────────────────── */}
      <Section className="px-4" delay={0}>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 p-6 sm:p-8 text-center">
          <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/10 rounded-full pointer-events-none" />
          <div className="absolute -bottom-6 -left-4 w-28 h-28 bg-white/5 rounded-full pointer-events-none" />
          <div className="relative max-w-md mx-auto">
            <Users className="w-8 h-8 text-white/90 mx-auto mb-3" />
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white mb-2">{c.ctaTitle}</h2>
            <p className="text-white/85 text-sm leading-relaxed mb-6">{c.ctaDesc}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => navigate("/locations")}
                className="ripple flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-indigo-600 text-sm font-bold transition-all active:scale-[0.97] hover:-translate-y-0.5 shadow-lg"
              >
                <MapPin className="w-4 h-4" />
                {c.ctaExplore}
              </button>
              <button
                onClick={() => navigate("/chat")}
                className="ripple flex items-center gap-2 px-5 py-3 rounded-xl bg-white/15 hover:bg-white/22 border border-white/20 text-white text-sm font-bold transition-all active:scale-[0.97] backdrop-blur-sm"
              >
                <Bot className="w-4 h-4" />
                {c.ctaAi}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
