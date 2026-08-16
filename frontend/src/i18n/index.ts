import { useAppStore } from "@/store";
import { translations } from "./translations";
export type { Lang, TranslationSchema } from "./translations";
export { LOCALE_TAGS } from "./translations";

export function useTranslation() {
  const lang = useAppStore((s) => s.lang);
  const dict = translations[lang] ?? translations.uz;

  function t(section: keyof typeof dict, key: string): string {
    const sec = dict[section] as Record<string, string>;
    return sec?.[key] ?? (translations.uz[section] as Record<string, string>)?.[key] ?? key;
  }

  return { t, lang };
}
