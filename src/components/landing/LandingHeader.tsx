import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export async function LandingHeader({ locale }: { locale: Locale }) {
  const t = await getTranslations("landing");

  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-[#F5F5F7]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <a
          href="#top"
          className="flex items-center gap-2 text-sm font-semibold tracking-wide text-[#1C1B28]"
        >
          <span className="text-[#2D2170]">✦</span>
          {t("brand")}
        </a>

        <nav className="hidden items-center gap-8 text-sm font-medium text-[#1C1B28] md:flex">
          <a href="#top" className="hover:text-[#2D2170]">
            {t("nav.home")}
          </a>
          <a href="#advisory" className="hover:text-[#2D2170]">
            {t("nav.advisory")}
          </a>
          <a href="#academy" className="hover:text-[#2D2170]">
            {t("nav.academy")}
          </a>
          <a href="#news" className="hover:text-[#2D2170]">
            {t("nav.news")}
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="rounded-[4px] bg-[#2D2170] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            {t("nav.contact")}
          </a>
          <div className="flex overflow-hidden rounded-[4px] border border-[#2D2170]/20 text-xs font-semibold">
            <Link
              href="/"
              locale="ja"
              className={
                locale === "ja"
                  ? "bg-[#2D2170] px-2 py-1 text-white"
                  : "px-2 py-1 text-[#2D2170]"
              }
            >
              JA
            </Link>
            <Link
              href="/"
              locale="en"
              className={
                locale === "en"
                  ? "bg-[#2D2170] px-2 py-1 text-white"
                  : "px-2 py-1 text-[#2D2170]"
              }
            >
              EN
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
