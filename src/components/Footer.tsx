import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations();

  return (
    <footer className="mt-auto border-t border-black/10 py-6">
      <div className="mx-auto max-w-3xl px-4 text-center text-xs text-black/50 sm:px-6">
        {t("footer.copyright", {
          year: new Date().getFullYear(),
          siteName: t("site.name"),
        })}
      </div>
    </footer>
  );
}
