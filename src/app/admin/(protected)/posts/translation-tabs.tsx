import Link from "next/link";
import { createTranslation } from "./actions";
import type { Post } from "@/lib/types";

export function TranslationTabs({
  post,
  sibling,
}: {
  post: Post;
  sibling: Post | null;
}) {
  const tabs: { locale: "ja" | "en"; label: string }[] = [
    { locale: "ja", label: "日本語版" },
    { locale: "en", label: "English version" },
  ];

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-black/10 pb-4">
      {tabs.map((tab) => {
        if (tab.locale === post.locale) {
          return (
            <span
              key={tab.locale}
              className="rounded-full bg-black px-3 py-1 text-xs font-medium text-white"
            >
              {tab.label}
            </span>
          );
        }

        if (sibling) {
          return (
            <Link
              key={tab.locale}
              href={`/admin/posts/${sibling.id}`}
              className="rounded-full border border-black/20 px-3 py-1 text-xs font-medium text-black/70 hover:bg-black/5"
            >
              {tab.label}を編集
            </Link>
          );
        }

        if (tab.locale === "en") {
          return (
            <form key={tab.locale} action={createTranslation.bind(null, post.id)}>
              <button
                type="submit"
                className="rounded-full border border-dashed border-black/30 px-3 py-1 text-xs font-medium text-black/60 hover:bg-black/5"
              >
                {tab.label}を新規作成
              </button>
            </form>
          );
        }

        return null;
      })}
    </div>
  );
}
