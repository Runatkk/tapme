import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";

export function buildAlternates(
  pathsByLocale: Partial<Record<Locale, string>>,
): Metadata["alternates"] {
  const languages: Record<string, string> = {};

  for (const locale of routing.locales) {
    const path = pathsByLocale[locale];
    if (path) languages[locale] = path;
  }

  const defaultPath = pathsByLocale[routing.defaultLocale];
  if (defaultPath) languages["x-default"] = defaultPath;

  return { languages };
}
