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
