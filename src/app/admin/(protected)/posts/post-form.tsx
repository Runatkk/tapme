"use client";

import { useState, type ChangeEvent } from "react";
import Image from "next/image";
import { MarkdownContent } from "@/components/MarkdownContent";
import { slugify } from "@/lib/slugify";
import type { Post, PostLocale } from "@/lib/types";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  initialPost?: Post;
  locale: PostLocale;
};

export function PostForm({ action, initialPost, locale }: Props) {
  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [slug, setSlug] = useState(initialPost?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(false);
  const [body, setBody] = useState(initialPost?.body ?? "");
  const [status, setStatus] = useState<"draft" | "published">(
    initialPost?.status ?? "draft",
  );
  const [showPreview, setShowPreview] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    initialPost?.thumbnail_url ?? null,
  );

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function handleThumbnailChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setThumbnailPreview(URL.createObjectURL(file));
  }

  return (
    <form action={action} className="flex flex-col gap-6">
      <input type="hidden" name="locale" value={locale} />
      {initialPost && (
        <input
          type="hidden"
          name="existing_thumbnail_url"
          value={initialPost.thumbnail_url ?? ""}
        />
      )}

      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-black/50">言語</span>
        <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs font-medium">
          {locale === "en" ? "English" : "日本語"}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium">
          タイトル
        </label>
        <input
          id="title"
          name="title"
          required
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="rounded-md border border-black/20 px-3 py-2 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="slug" className="text-sm font-medium">
          スラッグ（URL）
        </label>
        <input
          id="slug"
          name="slug"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          className="rounded-md border border-black/20 px-3 py-2 font-mono text-sm"
        />
        <p className="text-xs text-black/40">
          /{locale}/posts/{slug || "..."}
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="thumbnail" className="text-sm font-medium">
          サムネイル画像
        </label>
        {thumbnailPreview && (
          <div className="relative mb-2 aspect-video w-full max-w-xs overflow-hidden rounded-md bg-black/5">
            <Image
              src={thumbnailPreview}
              alt="サムネイルプレビュー"
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        )}
        <input
          id="thumbnail"
          name="thumbnail"
          type="file"
          accept="image/*"
          onChange={handleThumbnailChange}
          className="text-sm"
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
          <div className="min-h-64 rounded-md border border-black/20 p-4">
            <MarkdownContent body={body} />
          </div>
        ) : (
          <textarea
            id="body"
            name="body"
            required
            rows={16}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="rounded-md border border-black/20 px-3 py-2 font-mono text-sm"
          />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">公開状態</span>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="status"
              value="draft"
              checked={status === "draft"}
              onChange={() => setStatus("draft")}
            />
            下書き
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="status"
              value="published"
              checked={status === "published"}
              onChange={() => setStatus("published")}
            />
            公開する
          </label>
        </div>
      </div>

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
