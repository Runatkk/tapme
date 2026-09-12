import Link from "next/link";
import type { Metadata } from "next";
import { getAllPostsForAdmin } from "@/lib/posts";
import { formatDate } from "@/lib/format-date";
import { DeleteButton } from "./delete-button";
import type { PostLocale } from "@/lib/types";

export const metadata: Metadata = {
  title: "記事管理",
};

const LOCALE_TABS: { value: PostLocale; label: string }[] = [
  { value: "ja", label: "日本語" },
  { value: "en", label: "English" },
];

type Props = {
  searchParams: Promise<{ locale?: string }>;
};

export default async function AdminPostsPage({ searchParams }: Props) {
  const { locale: localeParam } = await searchParams;
  const locale: PostLocale = localeParam === "en" ? "en" : "ja";

  const posts = await getAllPostsForAdmin(locale);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">記事管理</h1>
        <Link
          href={`/admin/posts/new?locale=${locale}`}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
        >
          新規作成
        </Link>
      </div>

      <div className="mb-6 flex gap-1 border-b border-black/10">
        {LOCALE_TABS.map((tab) => (
          <Link
            key={tab.value}
            href={`/admin/posts?locale=${tab.value}`}
            className={`px-4 py-2 text-sm font-medium ${
              locale === tab.value
                ? "border-b-2 border-black text-black"
                : "text-black/50 hover:text-black"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {posts.length === 0 ? (
        <p className="text-sm text-black/50">まだ記事がありません。</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-black/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/10 bg-black/[.02] text-xs uppercase text-black/50">
              <tr>
                <th className="px-4 py-3">タイトル</th>
                <th className="px-4 py-3">状態</th>
                <th className="px-4 py-3">更新日時</th>
                <th className="px-4 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-black/5 last:border-0"
                >
                  <td className="px-4 py-3 font-medium">{post.title}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        post.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {post.status === "published" ? "公開中" : "下書き"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-black/60">
                    {formatDate(post.updated_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        編集
                      </Link>
                      <DeleteButton id={post.id} locale={post.locale} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
