import { createClient } from "@/lib/supabase/server";
import type { PageSection, PostLocale } from "@/lib/types";

export async function getVisibleSections(
  locale: PostLocale,
): Promise<PageSection[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("page_sections")
    .select("*")
    .eq("page", "home")
    .eq("locale", locale)
    .eq("is_visible", true)
    .order("position", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getAllSectionsForAdmin(
  locale: PostLocale,
): Promise<PageSection[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("page_sections")
    .select("*")
    .eq("page", "home")
    .eq("locale", locale)
    .order("position", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getSectionByIdForAdmin(
  id: string,
): Promise<PageSection | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("page_sections")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}
