import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function Header() {
  const t = await getTranslations();

  return (
    <header className="border-b border-black/10 bg-white/80 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-bold tracking-tight">
          {t("site.name")}
        </Link>
        <nav className="flex gap-4 text-sm">
          <Link href="/" className="hover:underline">
            {t("nav.home")}
          </Link>
          <Link href="/posts" className="hover:underline">
            {t("nav.posts")}
          </Link>
        </nav>
      </div>
    </header>
  );
}
