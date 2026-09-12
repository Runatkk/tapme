"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";
import { getPostByIdForAdmin, getTranslationSibling } from "@/lib/posts";
import { uploadImageIfProvided } from "@/lib/upload-image";
import type { PostLocale } from "@/lib/types";

function isLocale(value: FormDataEntryValue | null): value is PostLocale {
  return value === "ja" || value === "en";
}

function otherLocale(locale: PostLocale): PostLocale {
  return locale === "ja" ? "en" : "ja";
}

function revalidatePublicPaths(locale: PostLocale, slug?: string) {
  revalidatePath(`/${locale}`);
  revalidatePath(`/${locale}/posts`);
  revalidatePath("/admin/posts");
  if (slug) revalidatePath(`/${locale}/posts/${slug}`);
}

export async function createPost(formData: FormData) {
  const supabase = await createClient();

  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const body = String(formData.get("body") ?? "");
  const status = formData.get("status") === "published" ? "published" : "draft";
  const thumbnailFile = formData.get("thumbnail") as File | null;
  const localeField = formData.get("locale");
  const locale: PostLocale = isLocale(localeField) ? localeField : "ja";

  if (!title) throw new Error("タイトルを入力してください。");

  const slug = slugify(slugInput || title);
  const thumbnail_url = await uploadImageIfProvided(supabase, thumbnailFile);

  const { error } = await supabase.from("posts").insert({
    title,
    slug,
    body,
    status,
    locale,
    thumbnail_url,
  });

  if (error) throw new Error(error.message);

  revalidatePublicPaths(locale, slug);
  redirect(`/admin/posts?locale=${locale}`);
}

export async function updatePost(id: string, formData: FormData) {
  const supabase = await createClient();

  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const body = String(formData.get("body") ?? "");
  const status = formData.get("status") === "published" ? "published" : "draft";
  const thumbnailFile = formData.get("thumbnail") as File | null;
  const existingThumbnailUrl =
    String(formData.get("existing_thumbnail_url") ?? "") || null;
  const localeField = formData.get("locale");
  const locale: PostLocale = isLocale(localeField) ? localeField : "ja";

  if (!title) throw new Error("タイトルを入力してください。");

  const slug = slugify(slugInput || title);
  const uploadedUrl = await uploadImageIfProvided(supabase, thumbnailFile);
  const thumbnail_url = uploadedUrl ?? existingThumbnailUrl;

  const { error } = await supabase
    .from("posts")
    .update({ title, slug, body, status, thumbnail_url })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePublicPaths(locale, slug);
  redirect(`/admin/posts?locale=${locale}`);
}

export async function deletePost(id: string, locale: PostLocale) {
  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePublicPaths(locale);
}

export async function createTranslation(sourceId: string) {
  const source = await getPostByIdForAdmin(sourceId);
  if (!source) throw new Error("元の記事が見つかりません。");

  const targetLocale = otherLocale(source.locale);

  const existingSibling = await getTranslationSibling(
    source.translation_group_id,
    targetLocale,
  );
  if (existingSibling) {
    redirect(`/admin/posts/${existingSibling.id}`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .insert({
      title: source.title,
      slug: source.slug,
      body: "",
      status: "draft",
      locale: targetLocale,
      translation_group_id: source.translation_group_id,
      thumbnail_url: source.thumbnail_url,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/admin/posts");
  redirect(`/admin/posts/${data.id}`);
}
