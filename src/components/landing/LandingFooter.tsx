import { getTranslations } from "next-intl/server";

export async function LandingFooter() {
  const t = await getTranslations("landing");
  const advisoryLinks = t.raw("footer.advisoryLinks") as string[];
  const academyLinks = t.raw("footer.academyLinks") as string[];

  return (
    <footer className="border-t border-black/5 bg-white px-4 py-16 sm:px-6">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 sm:grid-cols-4">
        <div className="sm:col-span-1">
          <p className="flex items-center gap-2 text-sm font-semibold text-[#1C1B28]">
            <span className="text-[#2D2170]">✦</span>
            {t("brand")}
          </p>
          <p className="mt-3 max-w-xs text-sm text-[#6F6E80]">
            {t("footer.description")}
          </p>
          <div className="mt-4 flex h-6 w-6 items-center justify-center rounded border border-[#2D2170]/30 text-[#2D2170]">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M4.98 3.5C4.98 4.88 3.9 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.75h4V23h-4V8.75zM8.5 8.75h3.83v1.95h.05c.53-1 1.84-2.06 3.78-2.06 4.05 0 4.8 2.67 4.8 6.14V23h-4v-6.4c0-1.53-.03-3.5-2.13-3.5-2.14 0-2.47 1.67-2.47 3.39V23h-4V8.75z" />
            </svg>
          </div>
        </div>

        <div id="advisory">
          <h4 className="mb-4 text-xs font-semibold tracking-wide text-[#1C1B28]">
            {t("footer.advisoryHeading")}
          </h4>
          <div className="flex flex-col gap-3 text-sm text-[#6F6E80]">
            {advisoryLinks.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>

        <div id="academy">
          <h4 className="mb-4 text-xs font-semibold tracking-wide text-[#1C1B28]">
            {t("footer.academyHeading")}
          </h4>
          <div className="flex flex-col gap-3 text-sm text-[#6F6E80]">
            {academyLinks.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold tracking-wide text-[#1C1B28]">
            {t("footer.contactHeading")}
          </h4>
          <div className="flex flex-col gap-3 text-sm text-[#6F6E80]">
            <span>{t("footer.email")}</span>
            <span>{t("footer.phone")}</span>
            <span>{t("footer.address")}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-black/5 pt-6 text-xs text-[#6F6E80]">
        <span>{t("footer.copyright", { year: new Date().getFullYear() })}</span>
        <div className="flex gap-4">
          <span>{t("footer.privacyPolicy")}</span>
          <span>{t("footer.termsOfService")}</span>
        </div>
      </div>
    </footer>
  );
}
