import type { PostLocale } from "@/lib/types";

const INTL_LOCALE: Record<PostLocale, string> = {
  ja: "ja-JP",
  en: "en-US",
};

export function formatDate(iso: string, locale: PostLocale = "ja"): string {
  return new Date(iso).toLocaleDateString(INTL_LOCALE[locale], {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
