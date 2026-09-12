import { createClient } from "@/lib/supabase/server";
import type { Post, PostLocale } from "@/lib/types";

export async function getPublishedPosts(
  locale: PostLocale,
  limit?: number,
): Promise<Post[]> {
  const supabase = await createClient();
  let query = supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .eq("locale", locale)
    .order("created_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getPublishedPostBySlug(
  locale: PostLocale,
  slug: string,
): Promise<Post | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .eq("locale", locale)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getTranslationSibling(
  translationGroupId: string,
  locale: PostLocale,
  { publishedOnly = false }: { publishedOnly?: boolean } = {},
): Promise<Post | null> {
  const supabase = await createClient();
  let query = supabase
    .from("posts")
    .select("*")
    .eq("translation_group_id", translationGroupId)
    .eq("locale", locale);

  if (publishedOnly) query = query.eq("status", "published");

  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data;
}

export async function getAllPostsForAdmin(
  locale: PostLocale,
): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("locale", locale)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getPostByIdForAdmin(id: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}
