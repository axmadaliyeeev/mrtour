export type Lang = "uz" | "ru" | "en" | "zh" | "de" | "fr";

export interface TranslationSchema {
  nav: {
    home: string;
    locations: string;
    ai: string;
    services: string;
    profile: string;
    about: string;
    saved: string;
  };
  home: {
    badge: string;
    hero_title: string;
    hero_subtitle: string;
    explore_btn: string;
    ai_btn: string;
    stats_places: string;
    stats_rating: string;
    stats_travelers: string;
    stats_langs: string;
    featured_title: string;
    all_title: string;
    ai_banner_title: string;
    ai_banner_desc: string;
    ai_banner_btn: string;
    cat_all: string;
    cat_tarix: string;
    cat_tabiat: string;
    cat_madaniyat: string;
    cat_din: string;
    cat_arxeologiya: string;
    see_all: string;
    uzb_banner_title: string;
    uzb_banner_desc: string;
  };
  locations: {
    title: string;
    subtitle: string;
    search_placeholder: string;
    no_results: string;
    no_results_hint: string;
    filter_all: string;
    found: string;
    city_filter: string;
    sort_label: string;
    sort_rating: string;
    sort_price_asc: string;
    sort_price_desc: string;
    sort_reviews: string;
    clear_filters: string;
    clear: string;
  };
  card: {
    add_plan: string;
    in_plan: string;
    added_toast: string;
    removed_toast: string;
  };
  detail: {
    hours: string;
    price: string;
    transport: string;
    best_season: string;
    duration: string;
    region: string;
    reviews: string;
    no_reviews: string;
    write_review: string;
    add_plan: string;
    remove_plan: string;
    map: string;
    ai_insight: string;
    free: string;
    review_placeholder: string;
    submit_review: string;
    login_to_review: string;
    tag_all: string;
    description: string;
    practical_info: string;
    tags_section: string;
    how_to_get: string;
    price_label: string;
    duration_label: string;
    season_label: string;
    verified: string;
    not_found_title: string;
    not_found_desc: string;
    back_to_list: string;
    back: string;
    your_rating: string;
    insight_title: string;
    review_success: string;
    add_first_review: string;
    insight_loading: string;
    insight_error: string;
    smart_review_label: string;
    avg_rating: string;
    total_reviews: string;
  };
  chat: {
    title: string;
    subtitle: string;
    reset: string;
    welcome: string;
    quick_samarqand: string;
    quick_hotel: string;
    quick_transport: string;
    quick_top: string;
    quick_tips: string;
    plan_banner_title: string;
    plan_banner_desc: string;
    plan_banner_more: string;
    plan_btn: string;
    plan_view: string;
    quick_label: string;
    input_placeholder: string;
    hint: string;
    typing: string;
    plan_quick: string;
    places: string;
    error: string;
    waking_up: string;
    retry: string;
    disclaimer: string;
    empty_heading: string;
    reaction_thanks: string;
    quick_samarqand_prompt: string;
    quick_hotel_prompt: string;
    quick_transport_prompt: string;
    quick_top_prompt: string;
    quick_tips_prompt: string;
    plan_tour_intro: string;
    plan_tour_outro: string;
  };
  services: {
    title: string;
    subtitle: string;
    tab_restaurants: string;
    tab_hotels: string;
    tab_guides: string;
    tab_transport: string;
    tab_currency: string;
    restaurants_title: string;
    restaurants_desc: string;
    hotels_title: string;
    hotels_desc: string;
    guides_title: string;
    guides_desc: string;
    transport_title: string;
    transport_desc: string;
    currency_title: string;
    currency_desc: string;
    search_placeholder: string;
    not_found_restaurant: string;
    not_found_hotel: string;
    not_found_guide: string;
    available: string;
    busy: string;
    per_night: string;
    per_day: string;
    cuisine: string;
    languages: string;
    currency_calc_title: string;
    currency_calc_desc: string;
    currency_result_label: string;
    currency_table_title: string;
    currency_table_unit: string;
    train_type: string;
    train_desc: string;
    bus_type: string;
    bus_desc: string;
    taxi_type: string;
    taxi_desc: string;
    emergency: string;
    emergency_ambulance: string;
    emergency_fire: string;
    emergency_police: string;
    emergency_gas: string;
    emergency_tourism: string;
    hours_unit: string;
    min_unit: string;
    uzs_unit: string;
  };
  profile: {
    title: string;
    subtitle: string;
    guest_title: string;
    guest_desc: string;
    login_btn: string;
    register_btn: string;
    benefits_title: string;
    benefit1_title: string;
    benefit1_desc: string;
    benefit2_title: string;
    benefit2_desc: string;
    benefit3_title: string;
    benefit3_desc: string;
    benefit4_title: string;
    benefit4_desc: string;
    guest_plan_save_hint: string;
    theme_title: string;
    theme_dark: string;
    theme_light: string;
    plan_title: string;
    plan_empty_title: string;
    plan_empty_desc: string;
    plan_empty_btn: string;
    plan_add: string;
    plan_ai_btn: string;
    lang_title: string;
    settings_title: string;
    logout: string;
    logout_confirm: string;
    guest: string;
    sidebar_login_hint: string;
    plan_count_suffix: string;
    theme_label: string;
    emergency_label: string;
    stat_trips: string;
    stat_saved: string;
    stat_reviews: string;
    reviews_title: string;
    reviews_empty: string;
  };
  auth: {
    login: string;
    register: string;
    continue_google: string;
    continue_apple: string;
    or_email: string;
    social_soon: string;
    email: string;
    password: string;
    name: string;
    surname: string;
    country: string;
    email_placeholder: string;
    password_placeholder: string;
    name_placeholder: string;
    surname_placeholder: string;
    country_placeholder: string;
    new_password_placeholder: string;
    login_btn: string;
    loading_login: string;
    register_btn: string;
    loading_register: string;
    back: string;
    continue: string;
    start: string;
    step_lang: string;
    step_info: string;
    step_done: string;
    lang_question: string;
    success_title: string;
    success_desc: string;
    success_feature1: string;
    success_feature2: string;
    success_feature3: string;
    err_name_short: string;
    err_surname_short: string;
    err_email_required: string;
    err_email_invalid: string;
    err_password_short: string;
    err_login: string;
    err_register: string;
    err_waking_up: string;
    err_password_required: string;
  };
  saved: {
    title: string;
    subtitle: string;
    empty_title: string;
    empty_desc: string;
    explore_btn: string;
    ai_btn: string;
    cities_suffix: string;
    ai_banner: string;
  };
}

// ─── Uzbek (base) ────────────────────────────────────────────────────────────

const UZ: TranslationSchema = {
  nav: {
    home: "Asosiy",
    locations: "Joylar",
    ai: "AI",
    services: "Xizmat",
    profile: "Profil",
    about: "Haqida",
    saved: "Saqlangan",
  },
  home: {
    badge: "Rasmiy turizm gidi",
    hero_title: "O'zbekistonni Kashf Et",
    hero_subtitle:
      "Ipak yo'li mamlakati — ming yillik tarix, go'zal tabiat va mehmon do'st xalq. AI yordamchi bilan sayohatingizni rejalashtiring.",
    explore_btn: "Joylarni ko'rish",
    ai_btn: "Trova AI",
    stats_places: "Joy",
    stats_rating: "O'rtacha reyting",
    stats_travelers: "Sayohatchi",
    stats_langs: "Til",
    featured_title: "Tavsiya etilgan joylar",
    all_title: "Barcha joylar",
    ai_banner_title: "Trova AI sizga yordam beradi",
    ai_banner_desc: "Sayohat rejasi, joylar, narxlar haqida savol bering",
    ai_banner_btn: "Suhbat boshlash",
    cat_all: "Barchasi",
    cat_tarix: "Tarix",
    cat_tabiat: "Tabiat",
    cat_madaniyat: "Madaniyat",
    cat_din: "Din",
    cat_arxeologiya: "Arxeologiya",
    see_all: "Barchasini ko'rish",
    uzb_banner_title: "O'zbekiston haqida bilib oling",
    uzb_banner_desc: "Birinchi sayohatingizmi? Tarix, mintaqalar va amaliy maslahatlar shu yerda.",
  },
  locations: {
    title: "Joylar",
    subtitle: "O'zbekistonning barcha diqqatga sazovor joylari",
    search_placeholder: "Joy qidirish...",
    no_results: "Joy topilmadi",
    no_results_hint: "Boshqa kalit so'z bilan qidiring",
    filter_all: "Barchasi",
    found: "joy topildi",
    city_filter: "Shahar",
    sort_label: "Saralash",
    sort_rating: "Reyting",
    sort_price_asc: "Narx: arzon",
    sort_price_desc: "Narx: qimmat",
    sort_reviews: "Sharhlar",
    clear_filters: "Filtrlarni tozalash",
    clear: "Tozalash",
  },
  card: {
    add_plan: "Rejaga qo'sh",
    in_plan: "Rejada",
    added_toast: "rejaga qo'shildi!",
    removed_toast: "rejadan olib tashlandi",
  },
  detail: {
    hours: "Ish vaqti",
    price: "Kirish narxi",
    transport: "Transport",
    best_season: "Eng yaxshi mavsum",
    duration: "Tavsiya vaqti",
    region: "Viloyat",
    reviews: "Sharhlar",
    no_reviews: "Hali sharh yo'q. Birinchi bo'lib sharh qoldiring!",
    write_review: "Sharh yozish",
    add_plan: "Rejaga qo'sh",
    remove_plan: "Rejadan olib tashlash",
    map: "Xaritada ko'rish",
    ai_insight: "AI tahlil",
    free: "Bepul",
    review_placeholder: "Fikringizni yozing...",
    submit_review: "Yuborish",
    login_to_review: "Sharh qoldirish uchun kiring",
    tag_all: "Barchasi",
    description: "Tavsif",
    practical_info: "Amaliy ma'lumot",
    tags_section: "Teglar",
    how_to_get: "Qanday borish",
    price_label: "Narx",
    duration_label: "Muddat",
    season_label: "Fasl",
    verified: "Tasdiqlangan",
    not_found_title: "Joy topilmadi",
    not_found_desc: "Bu joy mavjud emas yoki o'chirilgan",
    back_to_list: "Joylarga qaytish",
    back: "Orqaga",
    your_rating: "Bahoyingiz",
    insight_title: "AI xulosasi",
    review_success: "Sharh qo'shildi!",
    add_first_review: "Birinchi sharh qoldiring",
    insight_loading: "Tahlil qilinmoqda...",
    insight_error: "Tahlil qilishda xato yuz berdi",
    smart_review_label: "SmartReview",
    avg_rating: "O'rtacha baho",
    total_reviews: "ta sharh",
  },
  chat: {
    title: "Trova AI",
    subtitle: "Onlayn · Doimo tayyor",
    reset: "Yangi",
    welcome:
      "Salom! Men Trova AI — trova ning sun'iy intellekt yordamchisiman.\n\nO'zbekistondagi sayohatingiz bo'yicha har qanday savolga javob bera olaman:\n• Joylar va diqqatga sazovor ob'ektlar\n• Mehmonxona va restoran tavsiyalari\n• Transport va yo'l yo'riqlari\n• Valyuta kurslari\n• Madaniyat va urf-odatlar\n\nNima haqida bilmoqchisiz?",
    quick_samarqand: "Samarqand sayohati",
    quick_hotel: "Mehmonxona",
    quick_transport: "Transport",
    quick_top: "Top joylar",
    quick_tips: "Maslahat",
    plan_banner_title: "ta joy saqlangan — tur rejasiga tayyor!",
    plan_banner_desc: "va yana",
    plan_banner_more: "ta — AI savollar berib, shaxsiy tur rejasi tuzadi",
    plan_btn: "Tur rejasi tuzish",
    plan_view: "Rejani ko'r",
    quick_label: "Tezkor savollar:",
    input_placeholder: "Xabar yozing... (Enter — yuborish)",
    hint: "Shift+Enter — yangi qator",
    typing: "Yozmoqda...",
    plan_quick: "Rejam",
    places: "joy",
    error:
      "Kechirasiz, hozirda server bilan bog'lanishda muammo bor. Iltimos, bir ozdan so'ng qayta urinib ko'ring.",
    waking_up: "Server uyg'onmoqda. Bir necha soniyadan so'ng qayta yuboring.",
    retry: "Qayta yuborish",
    disclaimer: "Trova AI xato qilishi mumkin. Muhim ma'lumotlarni tekshiring.",
    empty_heading: "Sizga qanday yordam bera olaman?",
    reaction_thanks: "Fikringiz uchun rahmat!",
    quick_samarqand_prompt: "Samarqandga 3 kunlik sayohat rejasi tuzib ber",
    quick_hotel_prompt: "Buxoroda eng yaxshi mehmonxonalarni tavsiya qil",
    quick_transport_prompt: "Toshkentdan Samarqandga qanday borsa bo'ladi?",
    quick_top_prompt: "O'zbekistonda albatta borish kerak bo'lgan 5 joy",
    quick_tips_prompt: "O'zbekistonga sayohat qilishda nimalarni bilish kerak?",
    plan_tour_intro: "Salom Trova AI! Men sayohat rejasi tuzmoqchiman. Saqlagan joylarim:",
    plan_tour_outro: "Iltimos, menga savollar berib, keyin professional tur rejasi tuzing.",
  },
  services: {
    title: "Xizmatlar",
    subtitle: "Sayohat uchun kerakli barcha xizmatlar",
    tab_restaurants: "Restoranlar",
    tab_hotels: "Hotellar",
    tab_guides: "Gidlar",
    tab_transport: "Transport",
    tab_currency: "Valyuta",
    restaurants_title: "Restoranlar",
    restaurants_desc: "O'zbekiston oshxonasi va xalqaro taomlar",
    hotels_title: "Mehmonxonalar",
    hotels_desc: "Qulay va arzon yashash joylari",
    guides_title: "Sayohat gidlari",
    guides_desc: "Tajribali mahalliy gidlar bilan sayohat qiling",
    transport_title: "Transport",
    transport_desc: "Shaharlar orasida qulay yo'nalishlar",
    currency_title: "Valyuta",
    currency_desc: "Tez valyuta hisob-kitob va kurslar",
    search_placeholder: "qidirish...",
    not_found_restaurant: "Restoran topilmadi",
    not_found_hotel: "Hotel topilmadi",
    not_found_guide: "Gid topilmadi",
    available: "Bo'sh",
    busy: "Band",
    per_night: "/kecha",
    per_day: "/kun",
    cuisine: "Taom",
    languages: "Tillar",
    currency_calc_title: "Valyuta kalkulyatori",
    currency_calc_desc: "Real vaqt kurslari",
    currency_result_label: "Natija (UZS):",
    currency_table_title: "Kurslar jadvali",
    currency_table_unit: "(1 valyuta = so'm)",
    train_type: "Tez poyezd",
    train_desc: "Afrosiyob — eng qulay va tez",
    bus_type: "Avtobus",
    bus_desc: "Shaharlararo yo'nalishlar",
    taxi_type: "Taksi / Yo'lovchi",
    taxi_desc: "Qisqa masofali qulay variant",
    emergency: "Muhim raqamlar",
    emergency_ambulance: "Tez yordam",
    emergency_fire: "Yong'in xizmati",
    emergency_police: "Politsiya",
    emergency_gas: "Gaz xizmati",
    emergency_tourism: "Turizm axborot markazi",
    hours_unit: "soat",
    min_unit: "daqiqa",
    uzs_unit: "so'm",
  },
  profile: {
    title: "Profil",
    subtitle: "Kirish yoki ro'yxatdan o'tish",
    guest_title: "Mehmon sifatida kiryapsiz",
    guest_desc: "Barcha imkoniyatlardan foydalanish uchun kiring",
    login_btn: "Kirish",
    register_btn: "Ro'yxatdan o'tish",
    benefits_title: "Akkaunt imkoniyatlari",
    benefit1_title: "Tur rejasi tuzish",
    benefit1_desc: "Joylarni saqlash va marshrutni tartiblashtirish",
    benefit2_title: "Trova AI bilan suhbat",
    benefit2_desc: "Shaxsiy sayohat yordamchisi",
    benefit3_title: "Sharh qoldirish",
    benefit3_desc: "Bo'lgan joylar haqida fikr bildiring",
    benefit4_title: "Ma'lumotlarni saqlash",
    benefit4_desc: "Reja va sozlamalar bulutda saqlanadi",
    guest_plan_save_hint: "Rejaingizni saqlash uchun",
    theme_title: "Sozlamalar",
    theme_dark: "Tungi rejim",
    theme_light: "Kunduzgi rejim",
    plan_title: "Mening rejam",
    plan_empty_title: "Reja bo'sh",
    plan_empty_desc: "Joylarni bookmarklab rejangizni tuzing",
    plan_empty_btn: "Joylarni ko'rish",
    plan_add: "Joy qo'shish",
    plan_ai_btn: "AI bilan tur rejasi yaratish",
    lang_title: "Til",
    settings_title: "Sozlamalar",
    logout: "Chiqish",
    logout_confirm: "Chiqish",
    guest: "Mehmon",
    sidebar_login_hint: "Kirish uchun bosing",
    plan_count_suffix: "joy rejada",
    theme_label: "Mavzu",
    emergency_label: "Favqulodda",
    stat_trips: "Shaharlar",
    stat_saved: "Saqlangan",
    stat_reviews: "Sharhlar",
    reviews_title: "Mening sharhlarim",
    reviews_empty: "Hali sharh qoldirmadingiz. Joy sahifasida fikringizni yozing.",
  },
  auth: {
    login: "Kirish",
    continue_google: "Google orqali davom etish",
    continue_apple: "Apple orqali davom etish",
    or_email: "yoki email orqali",
    social_soon: "Google/Apple orqali kirish tez orada qo'shiladi",
    register: "Ro'yxatdan o'tish",
    email: "Email",
    password: "Parol",
    name: "Ism",
    surname: "Familiya",
    country: "Mamlakat (ixtiyoriy)",
    email_placeholder: "example@email.com",
    password_placeholder: "Parolingiz",
    name_placeholder: "Ali",
    surname_placeholder: "Valiyev",
    country_placeholder: "O'zbekiston",
    new_password_placeholder: "Kamida 8 belgi",
    login_btn: "Kirish",
    loading_login: "Kirilmoqda...",
    register_btn: "Ro'yxatdan o'tish",
    loading_register: "Yuklanmoqda...",
    back: "Orqaga",
    continue: "Davom etish",
    start: "Boshlash",
    step_lang: "Til tanlash",
    step_info: "Ma'lumotlar",
    step_done: "Tayyor!",
    lang_question: "Qaysi tilda davom etasiz?",
    success_title: "Xush kelibsiz",
    success_desc: "Akkauntingiz muvaffaqiyatli yaratildi",
    success_feature1: "Trova AI bilan suhbat boshlash",
    success_feature2: "Joylarni rejaga qo'shish",
    success_feature3: "Shaxsiy tur yaratish",
    err_name_short: "Ism kamida 2 ta harf bo'lishi kerak",
    err_surname_short: "Familiya kamida 2 ta harf bo'lishi kerak",
    err_email_required: "Email kiritilishi shart",
    err_email_invalid: "Yaroqli email kiriting",
    err_password_short: "Parol kamida 8 ta belgi bo'lishi kerak",
    err_login: "Email yoki parol noto'g'ri",
    err_register: "Ro'yxatdan o'tishda xato yuz berdi",
    err_waking_up: "Server uyg'onmoqda, biroz kuting va yana urinib ko'ring.",
    err_password_required: "Parol kiritilishi shart",
  },
  saved: {
    title: "Saqlangan joylar",
    subtitle: "Rejaga qo'shgan joylaringiz shu yerda",
    empty_title: "Hali hech narsa saqlanmagan",
    empty_desc: "Yoqqan joylarni \"Rejaga qo'sh\" tugmasi orqali saqlang — ular shu yerda to'planadi.",
    explore_btn: "Joylarni ko'rish",
    ai_btn: "AI bilan reja tuzish",
    cities_suffix: "shahar",
    ai_banner: "Saqlangan joylar asosida Trova AI'dan marshrut so'rang",
  },
};

// ─── Russian ─────────────────────────────────────────────────────────────────

const RU: TranslationSchema = {
  nav: {
    home: "Главная",
    locations: "Места",
    ai: "ИИ",
    services: "Сервисы",
    profile: "Профиль",
    about: "О стране",
    saved: "Сохранено",
  },
  home: {
    badge: "Официальный туристический гид",
    hero_title: "Откройте для себя Узбекистан",
    hero_subtitle:
      "Страна Шёлкового пути — тысячелетняя история, великолепная природа и гостеприимный народ. Спланируйте своё путешествие с ИИ-помощником.",
    explore_btn: "Смотреть места",
    ai_btn: "Trova AI",
    stats_places: "Мест",
    stats_rating: "Средний рейтинг",
    stats_travelers: "Путешественников",
    stats_langs: "Языков",
    featured_title: "Рекомендуемые места",
    all_title: "Все места",
    ai_banner_title: "Trova AI готова помочь",
    ai_banner_desc:
      "Задайте вопрос о маршруте, достопримечательностях или ценах",
    ai_banner_btn: "Начать разговор",
    cat_all: "Все",
    cat_tarix: "История",
    cat_tabiat: "Природа",
    cat_madaniyat: "Культура",
    cat_din: "Религия",
    cat_arxeologiya: "Археология",
    see_all: "Смотреть все",
    uzb_banner_title: "Узнайте об Узбекистане",
    uzb_banner_desc: "Первое путешествие? История, регионы и практические советы здесь.",
  },
  locations: {
    title: "Места",
    subtitle: "Все достопримечательности Узбекистана",
    search_placeholder: "Поиск мест...",
    no_results: "Места не найдены",
    no_results_hint: "Попробуйте другое ключевое слово",
    filter_all: "Все",
    found: "мест найдено",
    city_filter: "Город",
    sort_label: "Сортировка",
    sort_rating: "Рейтинг",
    sort_price_asc: "Цена: дешевле",
    sort_price_desc: "Цена: дороже",
    sort_reviews: "Отзывы",
    clear_filters: "Сбросить фильтры",
    clear: "Сбросить",
  },
  card: {
    add_plan: "Добавить в план",
    in_plan: "В плане",
    added_toast: "добавлено в план!",
    removed_toast: "удалено из плана",
  },
  detail: {
    hours: "Часы работы",
    price: "Стоимость входа",
    transport: "Транспорт",
    best_season: "Лучшее время для посещения",
    duration: "Рекомендуемое время",
    region: "Область",
    reviews: "Отзывы",
    no_reviews: "Отзывов пока нет. Станьте первым!",
    write_review: "Написать отзыв",
    add_plan: "Добавить в план",
    remove_plan: "Убрать из плана",
    map: "Открыть на карте",
    ai_insight: "ИИ-анализ",
    free: "Бесплатно",
    review_placeholder: "Поделитесь своими впечатлениями...",
    submit_review: "Отправить",
    login_to_review: "Войдите, чтобы оставить отзыв",
    tag_all: "Все",
    description: "Описание",
    practical_info: "Практическая информация",
    tags_section: "Теги",
    how_to_get: "Как добраться",
    price_label: "Цена",
    duration_label: "Время",
    season_label: "Сезон",
    verified: "Подтверждено",
    not_found_title: "Место не найдено",
    not_found_desc: "Это место не существует или было удалено",
    back_to_list: "Вернуться к списку",
    back: "Назад",
    your_rating: "Ваша оценка",
    insight_title: "ИИ-анализ",
    review_success: "Отзыв добавлен!",
    add_first_review: "Оставьте первый отзыв",
    insight_loading: "Анализируем...",
    insight_error: "Ошибка при анализе",
    smart_review_label: "SmartReview",
    avg_rating: "Средняя оценка",
    total_reviews: "отзывов",
  },
  chat: {
    title: "Trova AI",
    subtitle: "Онлайн · Всегда на связи",
    reset: "Новый чат",
    welcome:
      "Здравствуйте! Я Trova AI — искусственный интеллект платформы trova.\n\nЯ готов ответить на любые вопросы о путешествии по Узбекистану:\n• Достопримечательности и интересные места\n• Рекомендации отелей и ресторанов\n• Транспорт и маршруты\n• Курсы валют\n• Культура и традиции\n\nО чём вы хотели бы узнать?",
    quick_samarqand: "Поездка в Самарканд",
    quick_hotel: "Отели",
    quick_transport: "Транспорт",
    quick_top: "Топ мест",
    quick_tips: "Советы путешественнику",
    plan_banner_title: "мест сохранено — готово к созданию тура!",
    plan_banner_desc: "и ещё",
    plan_banner_more:
      "мест — ИИ задаст вопросы и составит персональный маршрут",
    plan_btn: "Составить маршрут",
    plan_view: "Открыть план",
    quick_label: "Быстрые вопросы:",
    input_placeholder: "Напишите сообщение... (Enter — отправить)",
    hint: "Shift+Enter — новая строка",
    typing: "Печатает...",
    plan_quick: "Мой план",
    places: "мест",
    error:
      "Извините, в данный момент возникла проблема с подключением к серверу. Пожалуйста, попробуйте ещё раз чуть позже.",
    waking_up: "Сервер просыпается. Повторите отправку через несколько секунд.",
    retry: "Отправить снова",
    disclaimer: "Trova AI может ошибаться. Проверяйте важную информацию.",
    empty_heading: "Чем я могу вам помочь?",
    reaction_thanks: "Спасибо за ваш отзыв!",
    quick_samarqand_prompt: "Составь план поездки в Самарканд на 3 дня",
    quick_hotel_prompt: "Посоветуй лучшие отели в Бухаре",
    quick_transport_prompt: "Как добраться из Ташкента в Самарканд?",
    quick_top_prompt: "Топ-5 мест в Узбекистане, которые нужно обязательно посетить",
    quick_tips_prompt: "Что нужно знать перед поездкой в Узбекистан?",
    plan_tour_intro: "Привет, Trova AI! Я хочу спланировать маршрут. Мои сохранённые места:",
    plan_tour_outro: "Пожалуйста, задай мне несколько вопросов и составь профессиональный план тура.",
  },
  services: {
    title: "Сервисы",
    subtitle: "Всё необходимое для вашего путешествия",
    tab_restaurants: "Рестораны",
    tab_hotels: "Отели",
    tab_guides: "Гиды",
    tab_transport: "Транспорт",
    tab_currency: "Валюта",
    restaurants_title: "Рестораны",
    restaurants_desc: "Узбекская кухня и блюда мировой кулинарии",
    hotels_title: "Гостиницы",
    hotels_desc: "Комфортное и доступное жильё",
    guides_title: "Туристические гиды",
    guides_desc: "Путешествуйте с опытными местными гидами",
    transport_title: "Транспорт",
    transport_desc: "Удобные маршруты между городами",
    currency_title: "Валюта",
    currency_desc: "Быстрый обмен валют и актуальные курсы",
    search_placeholder: "поиск...",
    not_found_restaurant: "Рестораны не найдены",
    not_found_hotel: "Отели не найдены",
    not_found_guide: "Гиды не найдены",
    available: "Свободен",
    busy: "Занят",
    per_night: "/ночь",
    per_day: "/день",
    cuisine: "Кухня",
    languages: "Языки",
    currency_calc_title: "Валютный калькулятор",
    currency_calc_desc: "Курсы в режиме реального времени",
    currency_result_label: "Результат (UZS):",
    currency_table_title: "Таблица курсов",
    currency_table_unit: "(1 единица валюты = сум)",
    train_type: "Скоростной поезд",
    train_desc: "Афросиаб — самый быстрый и комфортный",
    bus_type: "Автобус",
    bus_desc: "Межгородские маршруты",
    taxi_type: "Такси / Попутчик",
    taxi_desc: "Удобный вариант на короткие расстояния",
    emergency: "Важные номера",
    emergency_ambulance: "Скорая помощь",
    emergency_fire: "Пожарная охрана",
    emergency_police: "Полиция",
    emergency_gas: "Газовая служба",
    emergency_tourism: "Туристический центр",
    hours_unit: "ч",
    min_unit: "мин",
    uzs_unit: "сум",
  },
  profile: {
    title: "Профиль",
    subtitle: "Войти или создать аккаунт",
    guest_title: "Вы просматриваете как гость",
    guest_desc: "Войдите, чтобы получить доступ ко всем функциям",
    login_btn: "Войти",
    register_btn: "Зарегистрироваться",
    benefits_title: "Возможности аккаунта",
    benefit1_title: "Составление маршрута",
    benefit1_desc: "Сохраняйте места и организуйте маршрут",
    benefit2_title: "Чат с Trova AI",
    benefit2_desc: "Персональный помощник путешественника",
    benefit3_title: "Оставлять отзывы",
    benefit3_desc: "Делитесь впечатлениями о посещённых местах",
    benefit4_title: "Сохранение данных",
    benefit4_desc: "Маршруты и настройки хранятся в облаке",
    guest_plan_save_hint: "Чтобы сохранить маршрут,",
    theme_title: "Настройки",
    theme_dark: "Тёмная тема",
    theme_light: "Светлая тема",
    plan_title: "Мой план",
    plan_empty_title: "План пуст",
    plan_empty_desc: "Добавляйте места в закладки, чтобы составить маршрут",
    plan_empty_btn: "Смотреть места",
    plan_add: "Добавить место",
    plan_ai_btn: "Создать маршрут с ИИ",
    lang_title: "Язык",
    settings_title: "Настройки",
    logout: "Выйти",
    logout_confirm: "Выйти",
    guest: "Гость",
    sidebar_login_hint: "Нажмите для входа",
    plan_count_suffix: "мест в плане",
    theme_label: "Тема",
    emergency_label: "Экстренные",
    stat_trips: "Города",
    stat_saved: "Сохранено",
    stat_reviews: "Отзывы",
    reviews_title: "Мои отзывы",
    reviews_empty: "Вы ещё не оставили отзывов. Напишите его на странице места.",
  },
  auth: {
    login: "Вход",
    continue_google: "Продолжить через Google",
    continue_apple: "Продолжить через Apple",
    or_email: "или через email",
    social_soon: "Вход через Google/Apple скоро появится",
    register: "Регистрация",
    email: "Email",
    password: "Пароль",
    name: "Имя",
    surname: "Фамилия",
    country: "Страна (необязательно)",
    email_placeholder: "example@email.com",
    password_placeholder: "Ваш пароль",
    name_placeholder: "Иван",
    surname_placeholder: "Иванов",
    country_placeholder: "Россия",
    new_password_placeholder: "Не менее 8 символов",
    login_btn: "Войти",
    loading_login: "Вход...",
    register_btn: "Зарегистрироваться",
    loading_register: "Загрузка...",
    back: "Назад",
    continue: "Продолжить",
    start: "Начать",
    step_lang: "Выбор языка",
    step_info: "Данные",
    step_done: "Готово!",
    lang_question: "На каком языке продолжить?",
    success_title: "Добро пожаловать",
    success_desc: "Ваш аккаунт успешно создан",
    success_feature1: "Начать общение с Trova AI",
    success_feature2: "Добавлять места в маршрут",
    success_feature3: "Создавать персональные туры",
    err_name_short: "Имя должно содержать не менее 2 символов",
    err_surname_short: "Фамилия должна содержать не менее 2 символов",
    err_email_required: "Введите email",
    err_email_invalid: "Введите корректный email",
    err_password_short: "Пароль должен содержать не менее 8 символов",
    err_login: "Неверный email или пароль",
    err_register: "Ошибка при регистрации",
    err_waking_up: "Сервер просыпается, подождите немного и попробуйте снова.",
    err_password_required: "Введите пароль",
  },
  saved: {
    title: "Сохранённые места",
    subtitle: "Места, добавленные в план, собраны здесь",
    empty_title: "Пока ничего не сохранено",
    empty_desc: "Сохраняйте понравившиеся места кнопкой «В план» — они появятся здесь.",
    explore_btn: "Смотреть места",
    ai_btn: "Составить план с AI",
    cities_suffix: "город(ов)",
    ai_banner: "Попросите Trova AI составить маршрут по сохранённым местам",
  },
};

// ─── English ──────────────────────────────────────────────────────────────────

const EN: TranslationSchema = {
  nav: {
    home: "Home",
    locations: "Locations",
    ai: "AI",
    services: "Services",
    profile: "Profile",
    about: "About",
    saved: "Saved",
  },
  home: {
    badge: "Official Travel Guide",
    hero_title: "Discover Uzbekistan",
    hero_subtitle:
      "The land of the Silk Road — centuries of history, breathtaking landscapes, and a culture of warm hospitality. Plan your journey with your AI travel companion.",
    explore_btn: "Explore Places",
    ai_btn: "Trova AI",
    stats_places: "Places",
    stats_rating: "Average Rating",
    stats_travelers: "Travelers",
    stats_langs: "Languages",
    featured_title: "Featured Destinations",
    all_title: "All Places",
    ai_banner_title: "Trova AI is here to help",
    ai_banner_desc: "Ask about itineraries, attractions, or travel costs",
    ai_banner_btn: "Start a Conversation",
    cat_all: "All",
    cat_tarix: "History",
    cat_tabiat: "Nature",
    cat_madaniyat: "Culture",
    cat_din: "Religion",
    cat_arxeologiya: "Archaeology",
    see_all: "See All",
    uzb_banner_title: "Learn about Uzbekistan",
    uzb_banner_desc: "First trip here? History, regions and practical tips in one place.",
  },
  locations: {
    title: "Locations",
    subtitle: "All attractions and destinations in Uzbekistan",
    search_placeholder: "Search places...",
    no_results: "No places found",
    no_results_hint: "Try a different keyword",
    filter_all: "All",
    found: "places found",
    city_filter: "City",
    sort_label: "Sort by",
    sort_rating: "Rating",
    sort_price_asc: "Price: low to high",
    sort_price_desc: "Price: high to low",
    sort_reviews: "Reviews",
    clear_filters: "Clear filters",
    clear: "Clear",
  },
  card: {
    add_plan: "Add to Plan",
    in_plan: "In Plan",
    added_toast: "added to plan!",
    removed_toast: "removed from plan",
  },
  detail: {
    hours: "Opening Hours",
    price: "Admission",
    transport: "Getting There",
    best_season: "Best Time to Visit",
    duration: "Recommended Duration",
    region: "Region",
    reviews: "Reviews",
    no_reviews: "No reviews yet. Be the first to share your experience!",
    write_review: "Write a Review",
    add_plan: "Add to Plan",
    remove_plan: "Remove from Plan",
    map: "View on Map",
    ai_insight: "AI Insights",
    free: "Free",
    review_placeholder: "Share your thoughts...",
    submit_review: "Submit",
    login_to_review: "Sign in to leave a review",
    tag_all: "All",
    description: "Description",
    practical_info: "Practical Info",
    tags_section: "Tags",
    how_to_get: "How to Get There",
    price_label: "Price",
    duration_label: "Duration",
    season_label: "Season",
    verified: "Verified",
    not_found_title: "Place Not Found",
    not_found_desc: "This place does not exist or has been removed",
    back_to_list: "Back to Places",
    back: "Back",
    your_rating: "Your Rating",
    insight_title: "AI Insights",
    review_success: "Review added!",
    add_first_review: "Be the first to review",
    insight_loading: "Analyzing...",
    insight_error: "Analysis failed",
    smart_review_label: "SmartReview",
    avg_rating: "Average rating",
    total_reviews: "reviews",
  },
  chat: {
    title: "Trova AI",
    subtitle: "Online · Always Ready",
    reset: "New Chat",
    welcome:
      "Hello! I'm Trova AI — the intelligent travel assistant of trova.\n\nI can answer any question about travelling in Uzbekistan:\n• Sights and points of interest\n• Hotel and restaurant recommendations\n• Transport and directions\n• Currency exchange rates\n• Culture and local customs\n\nWhat would you like to know?",
    quick_samarqand: "Trip to Samarkand",
    quick_hotel: "Hotels",
    quick_transport: "Transport",
    quick_top: "Top Places",
    quick_tips: "Travel Tips",
    plan_banner_title: "places saved — ready to build your tour!",
    plan_banner_desc: "and",
    plan_banner_more:
      "more — AI will ask a few questions and craft your personal itinerary",
    plan_btn: "Build Itinerary",
    plan_view: "View Plan",
    quick_label: "Quick questions:",
    input_placeholder: "Type a message... (Enter to send)",
    hint: "Shift+Enter for a new line",
    typing: "Typing...",
    plan_quick: "My Plan",
    places: "places",
    error:
      "Sorry, we're having trouble connecting to the server right now. Please try again in a moment.",
    waking_up: "The server is waking up. Please resend in a few seconds.",
    retry: "Try again",
    disclaimer: "Trova AI can make mistakes. Check important information.",
    empty_heading: "How can I help you?",
    reaction_thanks: "Thanks for your feedback!",
    quick_samarqand_prompt: "Create a 3-day itinerary for Samarkand",
    quick_hotel_prompt: "Recommend the best hotels in Bukhara",
    quick_transport_prompt: "How do I get from Tashkent to Samarkand?",
    quick_top_prompt: "Top 5 must-visit places in Uzbekistan",
    quick_tips_prompt: "What should I know before travelling to Uzbekistan?",
    plan_tour_intro: "Hi Trova AI! I want to create a travel plan. My saved places:",
    plan_tour_outro: "Please ask me a few questions and then create a professional tour plan.",
  },
  services: {
    title: "Services",
    subtitle: "Everything you need for your trip",
    tab_restaurants: "Restaurants",
    tab_hotels: "Hotels",
    tab_guides: "Guides",
    tab_transport: "Transport",
    tab_currency: "Currency",
    restaurants_title: "Restaurants",
    restaurants_desc: "Uzbek cuisine and international dining",
    hotels_title: "Hotels",
    hotels_desc: "Comfortable and affordable accommodation",
    guides_title: "Tour Guides",
    guides_desc: "Explore with experienced local guides",
    transport_title: "Transport",
    transport_desc: "Convenient routes between cities",
    currency_title: "Currency",
    currency_desc: "Fast currency conversion and live rates",
    search_placeholder: "search...",
    not_found_restaurant: "No restaurants found",
    not_found_hotel: "No hotels found",
    not_found_guide: "No guides found",
    available: "Available",
    busy: "Busy",
    per_night: "/night",
    per_day: "/day",
    cuisine: "Cuisine",
    languages: "Languages",
    currency_calc_title: "Currency Calculator",
    currency_calc_desc: "Live exchange rates",
    currency_result_label: "Result (UZS):",
    currency_table_title: "Exchange Rate Table",
    currency_table_unit: "(1 unit = soum)",
    train_type: "High-Speed Train",
    train_desc: "Afrosiyob — the fastest and most comfortable option",
    bus_type: "Bus",
    bus_desc: "Intercity bus routes",
    taxi_type: "Taxi / Shared Ride",
    taxi_desc: "The convenient choice for short distances",
    emergency: "Emergency Numbers",
    emergency_ambulance: "Ambulance",
    emergency_fire: "Fire Service",
    emergency_police: "Police",
    emergency_gas: "Gas Emergency",
    emergency_tourism: "Tourist Info Center",
    hours_unit: "h",
    min_unit: "min",
    uzs_unit: "UZS",
  },
  profile: {
    title: "Profile",
    subtitle: "Sign in or create an account",
    guest_title: "You're browsing as a guest",
    guest_desc: "Sign in to unlock all features",
    login_btn: "Sign In",
    register_btn: "Create Account",
    benefits_title: "Account Benefits",
    benefit1_title: "Build Itineraries",
    benefit1_desc: "Save places and organise your travel route",
    benefit2_title: "Chat with Trova AI",
    benefit2_desc: "Your personal AI travel companion",
    benefit3_title: "Leave Reviews",
    benefit3_desc: "Share your experience of the places you've visited",
    benefit4_title: "Save Your Data",
    benefit4_desc: "Plans and settings are stored in the cloud",
    guest_plan_save_hint: "To save your plan,",
    theme_title: "Settings",
    theme_dark: "Dark Mode",
    theme_light: "Light Mode",
    plan_title: "My Plan",
    plan_empty_title: "Your plan is empty",
    plan_empty_desc: "Bookmark places to start building your itinerary",
    plan_empty_btn: "Explore Places",
    plan_add: "Add a Place",
    plan_ai_btn: "Build an Itinerary with AI",
    lang_title: "Language",
    settings_title: "Settings",
    logout: "Sign Out",
    logout_confirm: "Sign Out",
    guest: "Guest",
    sidebar_login_hint: "Click to sign in",
    plan_count_suffix: "places in plan",
    theme_label: "Theme",
    emergency_label: "Emergency",
    stat_trips: "Cities",
    stat_saved: "Saved",
    stat_reviews: "Reviews",
    reviews_title: "My Reviews",
    reviews_empty: "You haven't written a review yet. Leave one on a place's page.",
  },
  auth: {
    login: "Sign In",
    continue_google: "Continue with Google",
    continue_apple: "Continue with Apple",
    or_email: "or continue with email",
    social_soon: "Google/Apple sign-in is coming soon",
    register: "Create Account",
    email: "Email",
    password: "Password",
    name: "First Name",
    surname: "Last Name",
    country: "Country (optional)",
    email_placeholder: "example@email.com",
    password_placeholder: "Your password",
    name_placeholder: "Alex",
    surname_placeholder: "Smith",
    country_placeholder: "United States",
    new_password_placeholder: "At least 8 characters",
    login_btn: "Sign In",
    loading_login: "Signing in...",
    register_btn: "Create Account",
    loading_register: "Loading...",
    back: "Back",
    continue: "Continue",
    start: "Get Started",
    step_lang: "Choose Language",
    step_info: "Your Details",
    step_done: "All Done!",
    lang_question: "Which language would you like to use?",
    success_title: "Welcome!",
    success_desc: "Your account has been created successfully",
    success_feature1: "Start chatting with Trova AI",
    success_feature2: "Add places to your itinerary",
    success_feature3: "Create your personalised tour",
    err_name_short: "First name must be at least 2 characters",
    err_surname_short: "Last name must be at least 2 characters",
    err_email_required: "Please enter your email",
    err_email_invalid: "Please enter a valid email address",
    err_password_short: "Password must be at least 8 characters",
    err_login: "Incorrect email or password",
    err_register: "Something went wrong during registration",
    err_waking_up: "Server is waking up — please wait a moment and try again.",
    err_password_required: "Please enter your password",
  },
  saved: {
    title: "Saved Places",
    subtitle: "Everything you've added to your plan lives here",
    empty_title: "Nothing saved yet",
    empty_desc: "Save places you like with the \"Add to Plan\" button — they'll show up here.",
    explore_btn: "Browse places",
    ai_btn: "Plan with AI",
    cities_suffix: "cities",
    ai_banner: "Ask Trova AI to build a route from your saved places",
  },
};

// ─── Chinese Simplified ───────────────────────────────────────────────────────

const ZH: TranslationSchema = {
  nav: {
    home: "首页",
    locations: "景点",
    ai: "AI",
    services: "服务",
    profile: "我的",
    about: "关于",
    saved: "收藏",
  },
  home: {
    badge: "官方旅游指南",
    hero_title: "探索乌兹别克斯坦",
    hero_subtitle:
      "丝绸之路上的国度——千年历史、壮丽山河与热情好客的人民。借助 AI 助手，轻松规划您的旅程。",
    explore_btn: "浏览景点",
    ai_btn: "Trova AI",
    stats_places: "景点",
    stats_rating: "平均评分",
    stats_travelers: "旅行者",
    stats_langs: "语言",
    featured_title: "推荐目的地",
    all_title: "全部景点",
    ai_banner_title: "Trova AI 随时为您服务",
    ai_banner_desc: "询问行程、景点或旅行费用",
    ai_banner_btn: "开始对话",
    cat_all: "全部",
    cat_tarix: "历史",
    cat_tabiat: "自然",
    cat_madaniyat: "文化",
    cat_din: "宗教",
    cat_arxeologiya: "考古",
    see_all: "查看全部",
    uzb_banner_title: "了解乌兹别克斯坦",
    uzb_banner_desc: "第一次来这里？历史、地区与实用建议都在这里。",
  },
  locations: {
    title: "景点",
    subtitle: "乌兹别克斯坦所有旅游目的地",
    search_placeholder: "搜索景点...",
    no_results: "未找到相关景点",
    no_results_hint: "请尝试其他关键词",
    filter_all: "全部",
    found: "个景点",
    city_filter: "城市",
    sort_label: "排序",
    sort_rating: "评分",
    sort_price_asc: "价格：从低到高",
    sort_price_desc: "价格：从高到低",
    sort_reviews: "评论数",
    clear_filters: "清除筛选",
    clear: "清除",
  },
  card: {
    add_plan: "加入行程",
    in_plan: "已加入",
    added_toast: "已加入行程！",
    removed_toast: "已从行程中移除",
  },
  detail: {
    hours: "开放时间",
    price: "门票价格",
    transport: "交通方式",
    best_season: "最佳游览时节",
    duration: "建议游览时长",
    region: "所在地区",
    reviews: "评价",
    no_reviews: "暂无评价，快来留下第一条评价吧！",
    write_review: "撰写评价",
    add_plan: "加入行程",
    remove_plan: "从行程移除",
    map: "在地图上查看",
    ai_insight: "AI 解析",
    free: "免费",
    review_placeholder: "分享您的感受...",
    submit_review: "提交",
    login_to_review: "登录后即可留下评价",
    tag_all: "全部",
    description: "景点介绍",
    practical_info: "实用信息",
    tags_section: "标签",
    how_to_get: "如何抵达",
    price_label: "价格",
    duration_label: "时长",
    season_label: "季节",
    verified: "已认证",
    not_found_title: "未找到该景点",
    not_found_desc: "该景点不存在或已被删除",
    back_to_list: "返回景点列表",
    back: "返回",
    your_rating: "您的评分",
    insight_title: "AI 分析",
    review_success: "评价已添加！",
    add_first_review: "成为第一个评价者",
    insight_loading: "分析中...",
    insight_error: "分析失败",
    smart_review_label: "SmartReview",
    avg_rating: "平均评分",
    total_reviews: "条评价",
  },
  chat: {
    title: "Trova AI",
    subtitle: "在线 · 随时待命",
    reset: "新对话",
    welcome:
      "您好！我是 Trova AI — trova 的智能旅行助手。\n\n关于乌兹别克斯坦的旅行，我可以解答您的任何问题：\n• 景点与名胜古迹\n• 酒店与餐厅推荐\n• 交通与路线指引\n• 汇率信息\n• 文化与风俗习惯\n\n请问您想了解什么？",
    quick_samarqand: "撒马尔罕之旅",
    quick_hotel: "酒店",
    quick_transport: "交通",
    quick_top: "热门景点",
    quick_tips: "旅行贴士",
    plan_banner_title: "个景点已保存——随时可生成行程！",
    plan_banner_desc: "还有",
    plan_banner_more: "个——AI 将提问并为您量身定制专属行程",
    plan_btn: "生成行程",
    plan_view: "查看行程",
    quick_label: "快速提问：",
    input_placeholder: "输入消息...（按 Enter 发送）",
    hint: "Shift+Enter 换行",
    typing: "正在输入...",
    plan_quick: "我的行程",
    places: "个景点",
    error: "抱歉，当前无法连接到服务器，请稍后再试。",
    waking_up: "服务器正在唤醒，请几秒后重新发送。",
    retry: "重新发送",
    disclaimer: "Trova AI 可能会出错，请核实重要信息。",
    empty_heading: "我能为您做些什么？",
    reaction_thanks: "感谢您的反馈！",
    quick_samarqand_prompt: "为我制定撒马尔罕3天行程",
    quick_hotel_prompt: "推荐布哈拉最好的酒店",
    quick_transport_prompt: "如何从塔什干前往撒马尔罕？",
    quick_top_prompt: "乌兹别克斯坦必去的5个地方",
    quick_tips_prompt: "去乌兹别克斯坦旅游需要注意什么？",
    plan_tour_intro: "你好，Trova AI！我想制定旅行计划。我保存的地点：",
    plan_tour_outro: "请先问我几个问题，然后为我制定专业的行程安排。",
  },
  services: {
    title: "服务",
    subtitle: "旅行所需的一切服务",
    tab_restaurants: "餐厅",
    tab_hotels: "酒店",
    tab_guides: "导游",
    tab_transport: "交通",
    tab_currency: "货币",
    restaurants_title: "餐厅",
    restaurants_desc: "乌兹别克传统美食与国际餐饮",
    hotels_title: "酒店",
    hotels_desc: "舒适实惠的住宿选择",
    guides_title: "旅游导游",
    guides_desc: "与经验丰富的本地导游同行",
    transport_title: "交通",
    transport_desc: "城市间便捷出行路线",
    currency_title: "货币兑换",
    currency_desc: "即时汇率与快速换算",
    search_placeholder: "搜索...",
    not_found_restaurant: "未找到相关餐厅",
    not_found_hotel: "未找到相关酒店",
    not_found_guide: "未找到相关导游",
    available: "可预订",
    busy: "已约满",
    per_night: "/晚",
    per_day: "/天",
    cuisine: "菜系",
    languages: "语言",
    currency_calc_title: "货币计算器",
    currency_calc_desc: "实时汇率",
    currency_result_label: "结果（UZS）：",
    currency_table_title: "汇率表",
    currency_table_unit: "（1单位外币 = 苏姆）",
    train_type: "高速列车",
    train_desc: "阿弗罗西雅卜号——最快、最舒适的选择",
    bus_type: "客车",
    bus_desc: "城际大巴线路",
    taxi_type: "出租车 / 拼车",
    taxi_desc: "短途出行的便捷之选",
    emergency: "紧急联系电话",
    emergency_ambulance: "急救",
    emergency_fire: "消防",
    emergency_police: "警察",
    emergency_gas: "燃气服务",
    emergency_tourism: "旅游信息中心",
    hours_unit: "小时",
    min_unit: "分钟",
    uzs_unit: "苏姆",
  },
  profile: {
    title: "个人中心",
    subtitle: "登录或注册账号",
    guest_title: "您正以游客身份浏览",
    guest_desc: "登录后即可使用全部功能",
    login_btn: "登录",
    register_btn: "注册",
    benefits_title: "账号专属权益",
    benefit1_title: "制定行程",
    benefit1_desc: "保存景点并规划旅行路线",
    benefit2_title: "与 Trova AI 对话",
    benefit2_desc: "您的专属 AI 旅行助手",
    benefit3_title: "发表评价",
    benefit3_desc: "分享您对游览地点的感受",
    benefit4_title: "数据云端保存",
    benefit4_desc: "行程与设置同步保存至云端",
    guest_plan_save_hint: "要保存您的行程，请",
    theme_title: "设置",
    theme_dark: "深色模式",
    theme_light: "浅色模式",
    plan_title: "我的行程",
    plan_empty_title: "行程为空",
    plan_empty_desc: "收藏景点，开始规划您的旅程",
    plan_empty_btn: "浏览景点",
    plan_add: "添加景点",
    plan_ai_btn: "与 AI 共同制定行程",
    lang_title: "语言",
    settings_title: "设置",
    logout: "退出登录",
    logout_confirm: "退出登录",
    guest: "游客",
    sidebar_login_hint: "点击登录",
    plan_count_suffix: "个地点",
    theme_label: "主题",
    emergency_label: "紧急",
    stat_trips: "城市",
    stat_saved: "收藏",
    stat_reviews: "评价",
    reviews_title: "我的评价",
    reviews_empty: "您还没有发表评价。可在地点页面留下您的看法。",
  },
  auth: {
    login: "登录",
    continue_google: "使用 Google 继续",
    continue_apple: "使用 Apple 继续",
    or_email: "或使用邮箱",
    social_soon: "Google/Apple 登录即将上线",
    register: "注册",
    email: "邮箱",
    password: "密码",
    name: "名字",
    surname: "姓氏",
    country: "国家（选填）",
    email_placeholder: "example@email.com",
    password_placeholder: "请输入密码",
    name_placeholder: "张",
    surname_placeholder: "伟",
    country_placeholder: "中国",
    new_password_placeholder: "至少 8 个字符",
    login_btn: "登录",
    loading_login: "登录中...",
    register_btn: "注册账号",
    loading_register: "加载中...",
    back: "返回",
    continue: "下一步",
    start: "开始",
    step_lang: "选择语言",
    step_info: "填写信息",
    step_done: "完成！",
    lang_question: "请选择您使用的语言",
    success_title: "欢迎加入",
    success_desc: "您的账号已成功创建",
    success_feature1: "开始与 Trova AI 对话",
    success_feature2: "将景点加入行程",
    success_feature3: "打造专属旅行路线",
    err_name_short: "名字至少需要 2 个字符",
    err_surname_short: "姓氏至少需要 2 个字符",
    err_email_required: "请输入邮箱",
    err_email_invalid: "请输入有效的邮箱地址",
    err_password_short: "密码至少需要 8 个字符",
    err_login: "邮箱或密码错误",
    err_register: "注册过程中出现错误",
    err_waking_up: "服务器正在唤醒，请稍等片刻后重试。",
    err_password_required: "请输入密码",
  },
  saved: {
    title: "收藏的地点",
    subtitle: "您添加到计划中的地点都在这里",
    empty_title: "还没有收藏任何地点",
    empty_desc: "点击「加入计划」保存喜欢的地点，它们会显示在这里。",
    explore_btn: "浏览地点",
    ai_btn: "使用 AI 规划",
    cities_suffix: "个城市",
    ai_banner: "让 Trova AI 根据收藏的地点规划路线",
  },
};

// ─── German ───────────────────────────────────────────────────────────────────

const DE: TranslationSchema = {
  nav: {
    home: "Startseite",
    locations: "Orte",
    ai: "KI",
    services: "Services",
    profile: "Profil",
    about: "Über",
    saved: "Gespeichert",
  },
  home: {
    badge: "Offizieller Reiseführer",
    hero_title: "Entdecken Sie Usbekistan",
    hero_subtitle:
      "Das Land der Seidenstraße — jahrtausendealte Geschichte, atemberaubende Natur und herzliche Gastfreundschaft. Planen Sie Ihre Reise mit dem KI-Reiseassistenten.",
    explore_btn: "Orte erkunden",
    ai_btn: "Trova AI",
    stats_places: "Orte",
    stats_rating: "Durchschnittsbewertung",
    stats_travelers: "Reisende",
    stats_langs: "Sprachen",
    featured_title: "Empfohlene Reiseziele",
    all_title: "Alle Orte",
    ai_banner_title: "Trova AI hilft Ihnen weiter",
    ai_banner_desc:
      "Fragen Sie nach Reiserouten, Sehenswürdigkeiten oder Reisekosten",
    ai_banner_btn: "Gespräch starten",
    cat_all: "Alle",
    cat_tarix: "Geschichte",
    cat_tabiat: "Natur",
    cat_madaniyat: "Kultur",
    cat_din: "Religion",
    cat_arxeologiya: "Archäologie",
    see_all: "Alle anzeigen",
    uzb_banner_title: "Erfahren Sie mehr über Usbekistan",
    uzb_banner_desc: "Erste Reise hierher? Geschichte, Regionen und praktische Tipps an einem Ort.",
  },
  locations: {
    title: "Orte",
    subtitle: "Alle Sehenswürdigkeiten in Usbekistan",
    search_placeholder: "Orte suchen...",
    no_results: "Keine Orte gefunden",
    no_results_hint: "Versuchen Sie ein anderes Suchwort",
    filter_all: "Alle",
    found: "Orte gefunden",
    city_filter: "Stadt",
    sort_label: "Sortieren",
    sort_rating: "Bewertung",
    sort_price_asc: "Preis: günstig",
    sort_price_desc: "Preis: teuer",
    sort_reviews: "Rezensionen",
    clear_filters: "Filter zurücksetzen",
    clear: "Zurücksetzen",
  },
  card: {
    add_plan: "Zum Plan hinzufügen",
    in_plan: "Im Plan",
    added_toast: "zum Plan hinzugefügt!",
    removed_toast: "aus dem Plan entfernt",
  },
  detail: {
    hours: "Öffnungszeiten",
    price: "Eintrittspreise",
    transport: "Anreise",
    best_season: "Beste Reisezeit",
    duration: "Empfohlene Besuchsdauer",
    region: "Region",
    reviews: "Bewertungen",
    no_reviews:
      "Noch keine Bewertungen. Schreiben Sie die erste Rezension!",
    write_review: "Bewertung schreiben",
    add_plan: "Zum Plan hinzufügen",
    remove_plan: "Aus dem Plan entfernen",
    map: "Auf der Karte anzeigen",
    ai_insight: "KI-Einblicke",
    free: "Kostenlos",
    review_placeholder: "Teilen Sie Ihre Erfahrungen...",
    submit_review: "Absenden",
    login_to_review: "Melden Sie sich an, um eine Bewertung zu schreiben",
    tag_all: "Alle",
    description: "Beschreibung",
    practical_info: "Praktische Infos",
    tags_section: "Stichworte",
    how_to_get: "Anreise",
    price_label: "Preis",
    duration_label: "Dauer",
    season_label: "Saison",
    verified: "Verifiziert",
    not_found_title: "Ort nicht gefunden",
    not_found_desc: "Dieser Ort existiert nicht oder wurde entfernt",
    back_to_list: "Zurück zur Liste",
    back: "Zurück",
    your_rating: "Ihre Bewertung",
    insight_title: "KI-Analyse",
    review_success: "Bewertung hinzugefügt!",
    add_first_review: "Erste Bewertung schreiben",
    insight_loading: "Analysiere...",
    insight_error: "Analyse fehlgeschlagen",
    smart_review_label: "SmartReview",
    avg_rating: "Ø Bewertung",
    total_reviews: "Bewertungen",
  },
  chat: {
    title: "Trova AI",
    subtitle: "Online · Immer bereit",
    reset: "Neuer Chat",
    welcome:
      "Hallo! Ich bin Trova AI — der intelligente Reiseassistent von trova.\n\nIch beantworte Ihnen gerne alle Fragen rund um Ihre Reise nach Usbekistan:\n• Sehenswürdigkeiten und interessante Orte\n• Hotel- und Restaurantempfehlungen\n• Transport und Wegbeschreibungen\n• Wechselkurse\n• Kultur und Traditionen\n\nWas möchten Sie wissen?",
    quick_samarqand: "Reise nach Samarkand",
    quick_hotel: "Hotels",
    quick_transport: "Transport",
    quick_top: "Top-Sehenswürdigkeiten",
    quick_tips: "Reisetipps",
    plan_banner_title: "Orte gespeichert — bereit für Ihre Reiseplanung!",
    plan_banner_desc: "und",
    plan_banner_more:
      "weitere — die KI stellt einige Fragen und erstellt Ihre persönliche Reiseroute",
    plan_btn: "Reiseroute erstellen",
    plan_view: "Plan anzeigen",
    quick_label: "Schnellfragen:",
    input_placeholder: "Nachricht eingeben... (Enter zum Senden)",
    hint: "Shift+Enter für einen Zeilenumbruch",
    typing: "Schreibt...",
    plan_quick: "Mein Plan",
    places: "Orte",
    error:
      "Entschuldigung, es gibt derzeit ein Problem mit der Serververbindung. Bitte versuchen Sie es in Kürze erneut.",
    waking_up: "Der Server wacht auf. Bitte in ein paar Sekunden erneut senden.",
    retry: "Erneut senden",
    disclaimer: "Trova AI kann Fehler machen. Überprüfen Sie wichtige Informationen.",
    empty_heading: "Wie kann ich Ihnen helfen?",
    reaction_thanks: "Danke für Ihr Feedback!",
    quick_samarqand_prompt: "Erstelle einen 3-Tage-Reiseplan für Samarkand",
    quick_hotel_prompt: "Empfehle die besten Hotels in Buchara",
    quick_transport_prompt: "Wie komme ich von Taschkent nach Samarkand?",
    quick_top_prompt: "Die 5 wichtigsten Sehenswürdigkeiten in Usbekistan",
    quick_tips_prompt: "Was muss ich vor der Reise nach Usbekistan wissen?",
    plan_tour_intro: "Hallo Trova AI! Ich möchte einen Reiseplan erstellen. Meine gespeicherten Orte:",
    plan_tour_outro: "Bitte stelle mir einige Fragen und erstelle dann einen professionellen Reiseplan.",
  },
  services: {
    title: "Services",
    subtitle: "Alles, was Sie für Ihre Reise benötigen",
    tab_restaurants: "Restaurants",
    tab_hotels: "Hotels",
    tab_guides: "Reiseführer",
    tab_transport: "Transport",
    tab_currency: "Währung",
    restaurants_title: "Restaurants",
    restaurants_desc: "Usbekische Küche und internationale Gerichte",
    hotels_title: "Hotels",
    hotels_desc: "Komfortable und preiswerte Unterkünfte",
    guides_title: "Reiseguides",
    guides_desc: "Reisen Sie mit erfahrenen lokalen Guides",
    transport_title: "Transport",
    transport_desc: "Bequeme Verbindungen zwischen Städten",
    currency_title: "Währungsrechner",
    currency_desc: "Schnelle Währungsumrechnung und aktuelle Kurse",
    search_placeholder: "suchen...",
    not_found_restaurant: "Keine Restaurants gefunden",
    not_found_hotel: "Keine Hotels gefunden",
    not_found_guide: "Keine Guides gefunden",
    available: "Verfügbar",
    busy: "Belegt",
    per_night: "/Nacht",
    per_day: "/Tag",
    cuisine: "Küche",
    languages: "Sprachen",
    currency_calc_title: "Währungsrechner",
    currency_calc_desc: "Live-Wechselkurse",
    currency_result_label: "Ergebnis (UZS):",
    currency_table_title: "Wechselkurstabelle",
    currency_table_unit: "(1 Einheit = Sum)",
    train_type: "Hochgeschwindigkeitszug",
    train_desc: "Afrosiyob — schnell, komfortabel und zuverlässig",
    bus_type: "Bus",
    bus_desc: "Überlandbusverbindungen",
    taxi_type: "Taxi / Mitfahrgelegenheit",
    taxi_desc: "Die praktische Option für kurze Strecken",
    emergency: "Notrufnummern",
    emergency_ambulance: "Notruf",
    emergency_fire: "Feuerwehr",
    emergency_police: "Polizei",
    emergency_gas: "Gasdienst",
    emergency_tourism: "Touristeninformation",
    hours_unit: "Std.",
    min_unit: "Min.",
    uzs_unit: "Sum",
  },
  profile: {
    title: "Profil",
    subtitle: "Anmelden oder Konto erstellen",
    guest_title: "Sie surfen als Gast",
    guest_desc: "Melden Sie sich an, um alle Funktionen zu nutzen",
    login_btn: "Anmelden",
    register_btn: "Konto erstellen",
    benefits_title: "Vorteile Ihres Kontos",
    benefit1_title: "Reiserouten planen",
    benefit1_desc: "Orte speichern und Ihre Route organisieren",
    benefit2_title: "Chat mit Trova AI",
    benefit2_desc: "Ihr persönlicher KI-Reisebegleiter",
    benefit3_title: "Bewertungen schreiben",
    benefit3_desc: "Teilen Sie Ihre Erlebnisse aus besuchten Orten",
    benefit4_title: "Daten sichern",
    benefit4_desc: "Pläne und Einstellungen werden in der Cloud gespeichert",
    guest_plan_save_hint: "Um Ihren Plan zu speichern,",
    theme_title: "Einstellungen",
    theme_dark: "Dunkles Design",
    theme_light: "Helles Design",
    plan_title: "Mein Plan",
    plan_empty_title: "Ihr Plan ist leer",
    plan_empty_desc: "Speichern Sie Orte, um Ihre Reiseroute zu erstellen",
    plan_empty_btn: "Orte erkunden",
    plan_add: "Ort hinzufügen",
    plan_ai_btn: "Reiseroute mit KI erstellen",
    lang_title: "Sprache",
    settings_title: "Einstellungen",
    logout: "Abmelden",
    logout_confirm: "Abmelden",
    guest: "Gast",
    sidebar_login_hint: "Zum Anmelden tippen",
    plan_count_suffix: "Orte im Plan",
    theme_label: "Thema",
    emergency_label: "Notfall",
    stat_trips: "Städte",
    stat_saved: "Gespeichert",
    stat_reviews: "Bewertungen",
    reviews_title: "Meine Bewertungen",
    reviews_empty: "Sie haben noch keine Bewertung geschrieben. Tun Sie dies auf der Seite eines Ortes.",
  },
  auth: {
    login: "Anmelden",
    continue_google: "Mit Google fortfahren",
    continue_apple: "Mit Apple fortfahren",
    or_email: "oder mit E-Mail",
    social_soon: "Anmeldung über Google/Apple folgt in Kürze",
    register: "Registrieren",
    email: "E-Mail",
    password: "Passwort",
    name: "Vorname",
    surname: "Nachname",
    country: "Land (optional)",
    email_placeholder: "example@email.com",
    password_placeholder: "Ihr Passwort",
    name_placeholder: "Hans",
    surname_placeholder: "Müller",
    country_placeholder: "Deutschland",
    new_password_placeholder: "Mindestens 8 Zeichen",
    login_btn: "Anmelden",
    loading_login: "Anmeldung läuft...",
    register_btn: "Konto erstellen",
    loading_register: "Wird geladen...",
    back: "Zurück",
    continue: "Weiter",
    start: "Loslegen",
    step_lang: "Sprache wählen",
    step_info: "Ihre Daten",
    step_done: "Fertig!",
    lang_question: "In welcher Sprache möchten Sie fortfahren?",
    success_title: "Herzlich willkommen",
    success_desc: "Ihr Konto wurde erfolgreich erstellt",
    success_feature1: "Chat mit Trova AI starten",
    success_feature2: "Orte zum Plan hinzufügen",
    success_feature3: "Ihre persönliche Tour erstellen",
    err_name_short: "Der Vorname muss mindestens 2 Zeichen lang sein",
    err_surname_short: "Der Nachname muss mindestens 2 Zeichen lang sein",
    err_email_required: "Bitte geben Sie Ihre E-Mail-Adresse ein",
    err_email_invalid: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
    err_password_short: "Das Passwort muss mindestens 8 Zeichen lang sein",
    err_login: "Falsche E-Mail-Adresse oder falsches Passwort",
    err_register: "Bei der Registrierung ist ein Fehler aufgetreten",
    err_waking_up: "Der Server wacht auf — bitte warten Sie einen Moment und versuchen Sie es erneut.",
    err_password_required: "Bitte geben Sie Ihr Passwort ein",
  },
  saved: {
    title: "Gespeicherte Orte",
    subtitle: "Alles, was Sie zu Ihrem Plan hinzugefügt haben, ist hier",
    empty_title: "Noch nichts gespeichert",
    empty_desc: "Speichern Sie Orte, die Ihnen gefallen, über „Zum Plan hinzufügen\" — sie erscheinen dann hier.",
    explore_btn: "Orte entdecken",
    ai_btn: "Mit KI planen",
    cities_suffix: "Städte",
    ai_banner: "Lassen Sie Trova AI eine Route aus Ihren gespeicherten Orten erstellen",
  },
};

// ─── French ───────────────────────────────────────────────────────────────────

const FR: TranslationSchema = {
  nav: {
    home: "Accueil",
    locations: "Lieux",
    ai: "IA",
    services: "Services",
    profile: "Profil",
    about: "À propos",
    saved: "Enregistrés",
  },
  home: {
    badge: "Guide touristique officiel",
    hero_title: "Découvrez l'Ouzbékistan",
    hero_subtitle:
      "Le pays de la Route de la Soie — une histoire millénaire, des paysages à couper le souffle et un peuple d'une hospitalité remarquable. Planifiez votre voyage avec votre assistant IA.",
    explore_btn: "Explorer les lieux",
    ai_btn: "Trova AI",
    stats_places: "Lieux",
    stats_rating: "Note moyenne",
    stats_travelers: "Voyageurs",
    stats_langs: "Langues",
    featured_title: "Destinations à la une",
    all_title: "Tous les lieux",
    ai_banner_title: "Trova AI est là pour vous aider",
    ai_banner_desc:
      "Posez vos questions sur les itinéraires, les sites ou les tarifs",
    ai_banner_btn: "Démarrer la conversation",
    cat_all: "Tout",
    cat_tarix: "Histoire",
    cat_tabiat: "Nature",
    cat_madaniyat: "Culture",
    cat_din: "Religion",
    cat_arxeologiya: "Archéologie",
    see_all: "Voir tout",
    uzb_banner_title: "Découvrir l'Ouzbékistan",
    uzb_banner_desc: "Premier voyage ici ? Histoire, régions et conseils pratiques réunis.",
  },
  locations: {
    title: "Lieux",
    subtitle: "Toutes les attractions touristiques d'Ouzbékistan",
    search_placeholder: "Rechercher un lieu...",
    no_results: "Aucun lieu trouvé",
    no_results_hint: "Essayez un autre mot-clé",
    filter_all: "Tout",
    found: "lieux trouvés",
    city_filter: "Ville",
    sort_label: "Trier par",
    sort_rating: "Note",
    sort_price_asc: "Prix : croissant",
    sort_price_desc: "Prix : décroissant",
    sort_reviews: "Avis",
    clear_filters: "Effacer les filtres",
    clear: "Effacer",
  },
  card: {
    add_plan: "Ajouter au plan",
    in_plan: "Dans le plan",
    added_toast: "ajouté au plan !",
    removed_toast: "retiré du plan",
  },
  detail: {
    hours: "Horaires d'ouverture",
    price: "Tarifs d'entrée",
    transport: "Comment y aller",
    best_season: "Meilleure période",
    duration: "Durée recommandée",
    region: "Région",
    reviews: "Avis",
    no_reviews:
      "Aucun avis pour l'instant. Soyez le premier à partager votre expérience !",
    write_review: "Rédiger un avis",
    add_plan: "Ajouter au plan",
    remove_plan: "Retirer du plan",
    map: "Voir sur la carte",
    ai_insight: "Analyse IA",
    free: "Gratuit",
    review_placeholder: "Partagez vos impressions...",
    submit_review: "Envoyer",
    login_to_review: "Connectez-vous pour laisser un avis",
    tag_all: "Tout",
    description: "Description",
    practical_info: "Informations pratiques",
    tags_section: "Tags",
    how_to_get: "Comment s'y rendre",
    price_label: "Prix",
    duration_label: "Durée",
    season_label: "Saison",
    verified: "Vérifié",
    not_found_title: "Lieu introuvable",
    not_found_desc: "Ce lieu n'existe pas ou a été supprimé",
    back_to_list: "Retour à la liste",
    back: "Retour",
    your_rating: "Votre note",
    insight_title: "Analyse IA",
    review_success: "Avis ajouté !",
    add_first_review: "Soyez le premier à noter",
    insight_loading: "Analyse en cours...",
    insight_error: "Échec de l'analyse",
    smart_review_label: "SmartReview",
    avg_rating: "Note moyenne",
    total_reviews: "avis",
  },
  chat: {
    title: "Trova AI",
    subtitle: "En ligne · Toujours disponible",
    reset: "Nouvelle conversation",
    welcome:
      "Bonjour ! Je suis Trova AI — l'assistant intelligent de trova.\n\nJe suis à votre disposition pour répondre à toutes vos questions sur l'Ouzbékistan :\n• Sites touristiques et points d'intérêt\n• Recommandations d'hôtels et de restaurants\n• Transports et itinéraires\n• Taux de change\n• Culture et traditions locales\n\nQue souhaitez-vous savoir ?",
    quick_samarqand: "Voyage à Samarcande",
    quick_hotel: "Hôtels",
    quick_transport: "Transports",
    quick_top: "Incontournables",
    quick_tips: "Conseils de voyage",
    plan_banner_title: "lieux enregistrés — prêt à créer votre circuit !",
    plan_banner_desc: "et encore",
    plan_banner_more:
      "— l'IA vous posera quelques questions pour concevoir votre itinéraire personnalisé",
    plan_btn: "Créer un itinéraire",
    plan_view: "Voir le plan",
    quick_label: "Questions rapides :",
    input_placeholder: "Écrivez un message… (Entrée pour envoyer)",
    hint: "Shift+Entrée pour un saut de ligne",
    typing: "En train d'écrire...",
    plan_quick: "Mon plan",
    places: "lieux",
    error:
      "Désolé, nous rencontrons un problème de connexion avec le serveur. Veuillez réessayer dans quelques instants.",
    waking_up: "Le serveur se réveille. Veuillez renvoyer dans quelques secondes.",
    retry: "Réessayer",
    disclaimer: "Trova AI peut faire des erreurs. Vérifiez les informations importantes.",
    empty_heading: "Comment puis-je vous aider ?",
    reaction_thanks: "Merci pour votre retour !",
    quick_samarqand_prompt: "Crée un itinéraire de 3 jours pour Samarcande",
    quick_hotel_prompt: "Recommande les meilleurs hôtels à Boukhara",
    quick_transport_prompt: "Comment aller de Tachkent à Samarcande ?",
    quick_top_prompt: "Les 5 incontournables en Ouzbékistan",
    quick_tips_prompt: "Que faut-il savoir avant de voyager en Ouzbékistan ?",
    plan_tour_intro: "Bonjour Trova AI ! Je veux créer un plan de voyage. Mes lieux sauvegardés :",
    plan_tour_outro: "Pose-moi quelques questions, puis crée un itinéraire professionnel.",
  },
  services: {
    title: "Services",
    subtitle: "Tout ce dont vous avez besoin pour votre voyage",
    tab_restaurants: "Restaurants",
    tab_hotels: "Hôtels",
    tab_guides: "Guides",
    tab_transport: "Transports",
    tab_currency: "Devises",
    restaurants_title: "Restaurants",
    restaurants_desc: "Cuisine ouzbèke et gastronomie internationale",
    hotels_title: "Hôtels",
    hotels_desc: "Hébergements confortables et abordables",
    guides_title: "Guides touristiques",
    guides_desc: "Voyagez avec des guides locaux expérimentés",
    transport_title: "Transports",
    transport_desc: "Liaisons pratiques entre les villes",
    currency_title: "Devises",
    currency_desc: "Conversion rapide et taux en temps réel",
    search_placeholder: "rechercher...",
    not_found_restaurant: "Aucun restaurant trouvé",
    not_found_hotel: "Aucun hôtel trouvé",
    not_found_guide: "Aucun guide trouvé",
    available: "Disponible",
    busy: "Occupé",
    per_night: "/nuit",
    per_day: "/jour",
    cuisine: "Cuisine",
    languages: "Langues",
    currency_calc_title: "Calculateur de devises",
    currency_calc_desc: "Taux de change en direct",
    currency_result_label: "Résultat (UZS) :",
    currency_table_title: "Tableau des taux",
    currency_table_unit: "(1 unité = soum)",
    train_type: "Train à grande vitesse",
    train_desc: "Afrosiyob — l'option la plus rapide et la plus confortable",
    bus_type: "Bus",
    bus_desc: "Liaisons interurbaines en autocar",
    taxi_type: "Taxi / Covoiturage",
    taxi_desc: "L'option pratique pour les courtes distances",
    emergency: "Numéros d'urgence",
    emergency_ambulance: "SAMU",
    emergency_fire: "Sapeurs-pompiers",
    emergency_police: "Police",
    emergency_gas: "Service du gaz",
    emergency_tourism: "Office de tourisme",
    hours_unit: "h",
    min_unit: "min",
    uzs_unit: "Sum",
  },
  profile: {
    title: "Profil",
    subtitle: "Se connecter ou créer un compte",
    guest_title: "Vous naviguez en tant qu'invité",
    guest_desc: "Connectez-vous pour accéder à toutes les fonctionnalités",
    login_btn: "Se connecter",
    register_btn: "Créer un compte",
    benefits_title: "Avantages du compte",
    benefit1_title: "Planifier des itinéraires",
    benefit1_desc: "Enregistrez des lieux et organisez votre parcours",
    benefit2_title: "Discuter avec Trova AI",
    benefit2_desc: "Votre assistant de voyage personnel",
    benefit3_title: "Laisser des avis",
    benefit3_desc: "Partagez vos expériences sur les lieux visités",
    benefit4_title: "Sauvegarder vos données",
    benefit4_desc: "Plans et paramètres synchronisés dans le cloud",
    guest_plan_save_hint: "Pour sauvegarder votre plan,",
    theme_title: "Paramètres",
    theme_dark: "Mode sombre",
    theme_light: "Mode clair",
    plan_title: "Mon plan",
    plan_empty_title: "Votre plan est vide",
    plan_empty_desc:
      "Enregistrez des lieux pour commencer à bâtir votre itinéraire",
    plan_empty_btn: "Explorer les lieux",
    plan_add: "Ajouter un lieu",
    plan_ai_btn: "Créer un itinéraire avec l'IA",
    lang_title: "Langue",
    settings_title: "Paramètres",
    logout: "Se déconnecter",
    logout_confirm: "Se déconnecter",
    guest: "Invité",
    sidebar_login_hint: "Cliquez pour vous connecter",
    plan_count_suffix: "lieux dans le plan",
    theme_label: "Thème",
    emergency_label: "Urgences",
    stat_trips: "Villes",
    stat_saved: "Enregistrés",
    stat_reviews: "Avis",
    reviews_title: "Mes avis",
    reviews_empty: "Vous n'avez pas encore laissé d'avis. Faites-le sur la page d'un lieu.",
  },
  auth: {
    login: "Connexion",
    continue_google: "Continuer avec Google",
    continue_apple: "Continuer avec Apple",
    or_email: "ou avec e-mail",
    social_soon: "La connexion via Google/Apple arrive bientôt",
    register: "Inscription",
    email: "E-mail",
    password: "Mot de passe",
    name: "Prénom",
    surname: "Nom de famille",
    country: "Pays (facultatif)",
    email_placeholder: "example@email.com",
    password_placeholder: "Votre mot de passe",
    name_placeholder: "Jean",
    surname_placeholder: "Dupont",
    country_placeholder: "France",
    new_password_placeholder: "Au moins 8 caractères",
    login_btn: "Se connecter",
    loading_login: "Connexion...",
    register_btn: "Créer un compte",
    loading_register: "Chargement...",
    back: "Retour",
    continue: "Continuer",
    start: "Commencer",
    step_lang: "Choisir la langue",
    step_info: "Vos informations",
    step_done: "C'est parti !",
    lang_question: "Dans quelle langue souhaitez-vous continuer ?",
    success_title: "Bienvenue",
    success_desc: "Votre compte a été créé avec succès",
    success_feature1: "Démarrer une conversation avec Trova AI",
    success_feature2: "Ajouter des lieux à votre itinéraire",
    success_feature3: "Créer votre circuit personnalisé",
    err_name_short: "Le prénom doit comporter au moins 2 caractères",
    err_surname_short:
      "Le nom de famille doit comporter au moins 2 caractères",
    err_email_required: "Veuillez saisir votre adresse e-mail",
    err_email_invalid: "Veuillez saisir une adresse e-mail valide",
    err_password_short: "Le mot de passe doit comporter au moins 8 caractères",
    err_login: "Adresse e-mail ou mot de passe incorrect",
    err_register: "Une erreur est survenue lors de l'inscription",
    err_waking_up: "Le serveur se réveille — veuillez patienter un instant et réessayer.",
    err_password_required: "Veuillez saisir votre mot de passe",
  },
  saved: {
    title: "Lieux enregistrés",
    subtitle: "Tout ce que vous avez ajouté à votre plan se trouve ici",
    empty_title: "Rien d'enregistré pour l'instant",
    empty_desc: "Enregistrez les lieux qui vous plaisent via « Ajouter au plan » — ils apparaîtront ici.",
    explore_btn: "Explorer les lieux",
    ai_btn: "Planifier avec l'IA",
    cities_suffix: "villes",
    ai_banner: "Demandez à Trova AI de créer un itinéraire à partir de vos lieux enregistrés",
  },
};

// ─── Export ───────────────────────────────────────────────────────────────────

export const translations: Record<Lang, TranslationSchema> = {
  uz: UZ,
  ru: RU,
  en: EN,
  zh: ZH,
  de: DE,
  fr: FR,
};
