import type { SupabaseClient } from "@supabase/supabase-js";

export async function uploadImageIfProvided(
  supabase: SupabaseClient,
  file: File | null,
): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("thumbnails")
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (error) throw new Error(`画像のアップロードに失敗しました: ${error.message}`);

  const { data } = supabase.storage.from("thumbnails").getPublicUrl(path);
  return data.publicUrl;
}
