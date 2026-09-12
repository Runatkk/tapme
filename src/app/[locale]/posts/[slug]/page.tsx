import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPublishedPostBySlug, getTranslationSibling } from "@/lib/posts";
import { MarkdownContent } from "@/components/MarkdownContent";
import { PublicChrome } from "@/components/PublicChrome";
import { formatDate } from "@/lib/format-date";
import { Link } from "@/i18n/navigation";
import { buildAlternates } from "@/lib/alternates";
import type { Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: Locale; slug: string }>;
};

function otherLocale(locale: Locale): Locale {
  return locale === "ja" ? "en" : "ja";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPublishedPostBySlug(locale, slug);
  if (!post) return {};

  const sibling = await getTranslationSibling(
    post.translation_group_id,
    otherLocale(locale),
    { publishedOnly: true },
  );

  const paths: Partial<Record<Locale, string>> = {
    [locale]: `/${locale}/posts/${post.slug}`,
  };
  if (sibling) {
    paths[otherLocale(locale)] = `/${otherLocale(locale)}/posts/${sibling.slug}`;
  }

  return {
    title: post.title,
    alternates: buildAlternates(paths),
  };
}

export default async function PostDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const post = await getPublishedPostBySlug(locale, slug);

  if (!post) notFound();

  const other = otherLocale(locale);
  const sibling = await getTranslationSibling(post.translation_group_id, other, {
    publishedOnly: true,
  });

  return (
    <PublicChrome>
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {post.thumbnail_url && (
          <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-xl bg-black/5">
            <Image
              src={post.thumbnail_url}
              alt={post.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <time className="text-sm text-black/50">
            {formatDate(post.created_at, post.locale)}
          </time>
          {sibling ? (
            <Link
              href={`/posts/${sibling.slug}`}
              locale={other}
              className="text-sm text-blue-600 hover:underline"
            >
              {other === "en" ? t("post.viewInEnglish") : t("post.viewInJapanese")}
            </Link>
          ) : (
            other === "en" && (
              <span className="text-sm text-black/30">
                {t("post.translationPending")}
              </span>
            )
          )}
        </div>

        <h1 className="mt-2 mb-8 text-2xl font-bold sm:text-3xl">
          {post.title}
        </h1>

        <MarkdownContent body={post.body} />
      </article>
    </PublicChrome>
  );
}
