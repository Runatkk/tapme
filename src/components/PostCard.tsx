import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/format-date";

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-black/10 transition hover:shadow-md"
    >
      <div className="relative aspect-video w-full bg-black/5">
        {post.thumbnail_url ? (
          <Image
            src={post.thumbnail_url}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-black/30">
            No Image
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <time className="text-xs text-black/50">
          {formatDate(post.created_at)}
        </time>
        <h3 className="line-clamp-2 font-semibold group-hover:underline">
          {post.title}
        </h3>
      </div>
    </Link>
  );
}
