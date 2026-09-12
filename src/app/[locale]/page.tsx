import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPublishedPosts } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { Link } from "@/i18n/navigation";
import { buildAlternates } from "@/lib/alternates";
import type { Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: buildAlternates({ ja: "/ja", en: "/en" }),
  };
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const posts = await getPublishedPosts(locale, 5);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <section className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t("site.name")}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-black/60">
          {t("site.description")}
        </p>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{t("home.latestPosts")}</h2>
          <Link href="/posts" className="text-sm text-black/60 hover:underline">
            {t("home.viewAll")}
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="text-sm text-black/50">{t("home.noPosts")}</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
