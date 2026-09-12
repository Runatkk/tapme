"use client";

import { useState, type ChangeEvent } from "react";
import Image from "next/image";
import { MarkdownContent } from "@/components/MarkdownContent";
import type { PageSection, PostLocale, SectionType } from "@/lib/types";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  locale: PostLocale;
  type: SectionType;
  initialSection?: PageSection;
};

export function SectionForm({ action, locale, type, initialSection }: Props) {
  const [body, setBody] = useState(initialSection?.body ?? "");
  const [showPreview, setShowPreview] = useState(false);
  const [isVisible, setIsVisible] = useState(
    initialSection?.is_visible ?? false,
  );
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialSection?.image_url ?? null,
  );

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  }

  return (
    <form action={action} className="flex flex-col gap-6">
      <input type="hidden" name="locale" value={locale} />
      {initialSection?.image_url && (
        <input
          type="hidden"
          name="existing_image_url"
          value={initialSection.image_url}
        />
      )}

      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-black/50">言語</span>
        <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs font-medium">
          {locale === "en" ? "English" : "日本語"}
        </span>
        <span className="text-xs font-medium text-black/50">種類</span>
        <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs font-medium">
          {type === "text" ? "テキストブロック" : "画像ブロック"}
        </span>
      </div>

      {type === "text" ? (
        <>
          <div className="flex flex-col gap-1">
            <label htmlFor="title" className="text-sm font-medium">
              見出し（任意）
            </label>
            <input
              id="title"
              name="title"
              defaultValue={initialSection?.title ?? ""}
              className="rounded-md border border-black/20 px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label htmlFor="body" className="text-sm font-medium">
                本文（Markdown）
              </label>
              <button
                type="button"
                onClick={() => setShowPreview((v) => !v)}
                className="text-xs text-black/60 hover:underline"
              >
                {showPreview ? "編集に戻る" : "プレビュー"}
              </button>
            </div>
            {showPreview ? (
              <div className="min-h-32 rounded-md border border-black/20 p-4">
                <MarkdownContent body={body} />
              </div>
            ) : (
              <textarea
                id="body"
                name="body"
                rows={8}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="rounded-md border border-black/20 px-3 py-2 font-mono text-sm"
              />
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-1">
            <label htmlFor="image" className="text-sm font-medium">
              画像
            </label>
            {imagePreview && (
              <div className="relative mb-2 aspect-video w-full max-w-xs overflow-hidden rounded-md bg-black/5">
                <Image
                  src={imagePreview}
                  alt="画像プレビュー"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            )}
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="image_alt" className="text-sm font-medium">
              代替テキスト（altテキスト）
            </label>
            <input
              id="image_alt"
              name="image_alt"
              defaultValue={initialSection?.image_alt ?? ""}
              className="rounded-md border border-black/20 px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="caption" className="text-sm font-medium">
              キャプション（任意）
            </label>
            <input
              id="caption"
              name="caption"
              defaultValue={initialSection?.caption ?? ""}
              className="rounded-md border border-black/20 px-3 py-2 text-sm"
            />
          </div>
        </>
      )}

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="is_visible"
          checked={isVisible}
          onChange={(e) => setIsVisible(e.target.checked)}
        />
        Topページに表示する
      </label>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          className="rounded-md bg-black px-6 py-2 text-sm font-medium text-white"
        >
          保存する
        </button>
      </div>
    </form>
  );
}
