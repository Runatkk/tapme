"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { getExcerpt } from "@/lib/excerpt";
import type { Post } from "@/lib/types";

function formatNewsDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type Copy = {
  heading: string;
  subheading: string;
  viewAll: string;
  empty: string;
};

export function LandingNews({ posts, copy }: { posts: Post[]; copy: Copy }) {
  const years = useMemo(() => {
    const set = new Set(posts.map((p) => new Date(p.created_at).getFullYear()));
    return Array.from(set).sort((a, b) => b - a);
  }, [posts]);

  const [selectedYear, setSelectedYear] = useState<number | null>(
    years[0] ?? null,
  );

  const visiblePosts = posts.filter(
    (p) => new Date(p.created_at).getFullYear() === selectedYear,
  );

  return (
    <section id="news" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2
            className="text-2xl font-semibold text-[#1C1B28] sm:text-3xl"
            style={{
              fontFamily:
                'var(--font-landing-heading), "Hiragino Mincho ProN", "Yu Mincho", Georgia, serif',
            }}
          >
            {copy.heading}
          </h2>
          <p className="mt-2 text-sm text-[#6F6E80]">{copy.subheading}</p>
        </div>

        {years.length > 0 && (
          <div className="flex gap-4 text-sm font-medium">
            {years.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => setSelectedYear(year)}
                className={`border-b-2 pb-1 ${
                  year === selectedYear
                    ? "border-[#2D2170] text-[#2D2170]"
                    : "border-transparent text-[#6F6E80] hover:text-[#1C1B28]"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 divide-y divide-black/5">
        {visiblePosts.length === 0 ? (
          <p className="py-8 text-sm text-[#6F6E80]">{copy.empty}</p>
        ) : (
          visiblePosts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.slug}`}
              className="flex flex-col gap-2 py-6 sm:flex-row sm:items-baseline sm:gap-6"
            >
              <span className="inline-block w-fit shrink-0 rounded-full bg-[#E9E9F4] px-3 py-1 text-[11.5px] text-[#1C1B28]">
                {formatNewsDate(post.created_at)}
              </span>
              <div>
                <p className="font-semibold text-[#1C1B28] hover:text-[#2D2170]">
                  {post.title}
                </p>
                <p className="mt-1 text-sm text-[#6F6E80]">
                  {getExcerpt(post.body)}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/posts"
          className="text-sm font-medium text-[#2D2170] hover:underline"
        >
          {copy.viewAll}
        </Link>
      </div>
    </section>
  );
}
