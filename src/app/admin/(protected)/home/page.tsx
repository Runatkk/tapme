import Link from "next/link";
import type { Metadata } from "next";
import { getAllSectionsForAdmin } from "@/lib/sections";
import { SectionControls } from "./section-controls";
import type { PostLocale } from "@/lib/types";

export const metadata: Metadata = {
  title: "ホーム編集",
};

const LOCALE_TABS: { value: PostLocale; label: string }[] = [
  { value: "ja", label: "日本語" },
  { value: "en", label: "English" },
];

type Props = {
  searchParams: Promise<{ locale?: string }>;
};

export default async function AdminHomePage({ searchParams }: Props) {
  const { locale: localeParam } = await searchParams;
  const locale: PostLocale = localeParam === "en" ? "en" : "ja";

  const sections = await getAllSectionsForAdmin(locale);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">ホーム編集</h1>
        <div className="flex gap-2">
          <Link
            href={`/admin/home/new?locale=${locale}&type=text`}
            className="rounded-md border border-black/20 px-4 py-2 text-sm font-medium hover:bg-black/5"
          >
            + テキストブロック
          </Link>
          <Link
            href={`/admin/home/new?locale=${locale}&type=image`}
            className="rounded-md border border-black/20 px-4 py-2 text-sm font-medium hover:bg-black/5"
          >
            + 画像ブロック
          </Link>
        </div>
      </div>

      <p className="mb-6 text-sm text-black/50">
        ここで追加したセクションは、Topページのヒーロー部分と「最新記事」の間に、上から順番に表示されます。
      </p>

      <div className="mb-6 flex gap-1 border-b border-black/10">
        {LOCALE_TABS.map((tab) => (
          <Link
            key={tab.value}
            href={`/admin/home?locale=${tab.value}`}
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

      {sections.length === 0 ? (
        <p className="text-sm text-black/50">
          まだセクションがありません。上のボタンから追加してください。
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="flex items-center justify-between rounded-lg border border-black/10 bg-white px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs font-medium">
                  {section.type === "text" ? "テキスト" : "画像"}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    section.is_visible
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {section.is_visible ? "表示中" : "非表示"}
                </span>
                <span className="text-sm font-medium">
                  {section.type === "text"
                    ? section.title || section.body?.slice(0, 30) || "(無題)"
                    : section.caption || section.image_alt || "(画像)"}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={`/admin/home/${section.id}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  編集
                </Link>
                <SectionControls
                  id={section.id}
                  locale={locale}
                  isFirst={index === 0}
                  isLast={index === sections.length - 1}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
