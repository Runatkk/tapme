"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";
import type { SupabaseClient } from "@supabase/supabase-js";

async function uploadThumbnailIfProvided(
  supabase: SupabaseClient,
  file: File | null,
): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("thumbnails")
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (error) throw new Error(`サムネイルのアップロードに失敗しました: ${error.message}`);

  const { data } = supabase.storage.from("thumbnails").getPublicUrl(path);
  return data.publicUrl;
}

function revalidatePublicPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/posts");
  revalidatePath("/admin/posts");
  if (slug) revalidatePath(`/posts/${slug}`);
}

export async function createPost(formData: FormData) {
  const supabase = await createClient();

  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const body = String(formData.get("body") ?? "");
  const status = formData.get("status") === "published" ? "published" : "draft";
  const thumbnailFile = formData.get("thumbnail") as File | null;

  if (!title) throw new Error("タイトルを入力してください。");

  const slug = slugify(slugInput || title);
  const thumbnail_url = await uploadThumbnailIfProvided(supabase, thumbnailFile);

  const { error } = await supabase.from("posts").insert({
    title,
    slug,
    body,
    status,
    thumbnail_url,
  });

  if (error) throw new Error(error.message);

  revalidatePublicPaths(slug);
  redirect("/admin/posts");
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

  if (!title) throw new Error("タイトルを入力してください。");

  const slug = slugify(slugInput || title);
  const uploadedUrl = await uploadThumbnailIfProvided(supabase, thumbnailFile);
  const thumbnail_url = uploadedUrl ?? existingThumbnailUrl;

  const { error } = await supabase
    .from("posts")
    .update({ title, slug, body, status, thumbnail_url })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePublicPaths(slug);
  redirect("/admin/posts");
}

export async function deletePost(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePublicPaths();
}
