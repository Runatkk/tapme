import Link from "next/link";
import { getPublishedPosts } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { siteConfig } from "@/lib/site";

export default async function Home() {
  const posts = await getPublishedPosts(5);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <section className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {siteConfig.name}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-black/60">
          {siteConfig.description}
        </p>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">最新記事</h2>
          <Link href="/posts" className="text-sm text-black/60 hover:underline">
            すべて見る →
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="text-sm text-black/50">まだ記事がありません。</p>
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
