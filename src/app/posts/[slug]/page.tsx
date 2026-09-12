import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPublishedPostBySlug } from "@/lib/posts";
import { MarkdownContent } from "@/components/MarkdownContent";
import { formatDate } from "@/lib/format-date";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return {};
  return { title: post.title };
}

export default async function PostDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) notFound();

  return (
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

      <time className="text-sm text-black/50">
        {formatDate(post.created_at)}
      </time>
      <h1 className="mt-2 mb-8 text-2xl font-bold sm:text-3xl">
        {post.title}
      </h1>

      <MarkdownContent body={post.body} />
    </article>
  );
}
