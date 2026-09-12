import Link from "next/link";
import type { Metadata } from "next";
import { SectionForm } from "../section-form";
import { createSection } from "../actions";
import type { PostLocale, SectionType } from "@/lib/types";

export const metadata: Metadata = {
  title: "セクション追加",
};

type Props = {
  searchParams: Promise<{ locale?: string; type?: string }>;
};

export default async function NewSectionPage({ searchParams }: Props) {
  const { locale: localeParam, type: typeParam } = await searchParams;
  const locale: PostLocale = localeParam === "en" ? "en" : "ja";

  if (typeParam !== "text" && typeParam !== "image") {
    return (
      <div className="max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold">セクション追加</h1>
        <p className="mb-4 text-sm text-black/60">追加するブロックの種類を選んでください。</p>
        <div className="flex gap-3">
          <Link
            href={`/admin/home/new?locale=${locale}&type=text`}
            className="rounded-md border border-black/20 px-4 py-2 text-sm font-medium hover:bg-black/5"
          >
            テキストブロック
          </Link>
          <Link
            href={`/admin/home/new?locale=${locale}&type=image`}
            className="rounded-md border border-black/20 px-4 py-2 text-sm font-medium hover:bg-black/5"
          >
            画像ブロック
          </Link>
        </div>
      </div>
    );
  }

  const type: SectionType = typeParam;

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">セクション追加</h1>
      <SectionForm action={createSection} locale={locale} type={type} />
    </div>
  );
}
