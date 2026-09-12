import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPublishedPosts } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { PublicChrome } from "@/components/PublicChrome";
import { buildAlternates } from "@/lib/alternates";
import type { Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t("posts.title"),
    alternates: buildAlternates({ ja: "/ja/posts", en: "/en/posts" }),
  };
}

export default async function PostsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const posts = await getPublishedPosts(locale);

  return (
    <PublicChrome>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="mb-8 text-2xl font-bold">{t("posts.title")}</h1>

        {posts.length === 0 ? (
          <p className="text-sm text-black/50">{t("home.noPosts")}</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </PublicChrome>
  );
}
