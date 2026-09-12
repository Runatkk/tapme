import type { Metadata } from "next";
import { PostForm } from "../post-form";
import { createPost } from "../actions";
import type { PostLocale } from "@/lib/types";

export const metadata: Metadata = {
  title: "新規記事作成",
};

type Props = {
  searchParams: Promise<{ locale?: string }>;
};

export default async function NewPostPage({ searchParams }: Props) {
  const { locale: localeParam } = await searchParams;
  const locale: PostLocale = localeParam === "en" ? "en" : "ja";

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">
        新規記事作成（{locale === "en" ? "English" : "日本語"}）
      </h1>
      <PostForm action={createPost} locale={locale} />
    </div>
  );
}
