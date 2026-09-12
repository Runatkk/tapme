"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAllSectionsForAdmin, getSectionByIdForAdmin } from "@/lib/sections";
import { uploadImageIfProvided } from "@/lib/upload-image";
import type { PostLocale, SectionType } from "@/lib/types";

function isLocale(value: FormDataEntryValue | null): value is PostLocale {
  return value === "ja" || value === "en";
}

function isSectionType(value: FormDataEntryValue | null): value is SectionType {
  return value === "text" || value === "image";
}

function revalidateHome(locale: PostLocale) {
  revalidatePath(`/${locale}`);
  revalidatePath("/admin/home");
}

export async function createSection(formData: FormData) {
  const supabase = await createClient();

  const localeField = formData.get("locale");
  const locale: PostLocale = isLocale(localeField) ? localeField : "ja";
  const typeField = formData.get("type");
  const type: SectionType = isSectionType(typeField) ? typeField : "text";
  const title = String(formData.get("title") ?? "").trim() || null;
  const body = String(formData.get("body") ?? "").trim() || null;
  const imageAlt = String(formData.get("image_alt") ?? "").trim() || null;
  const caption = String(formData.get("caption") ?? "").trim() || null;
  const isVisible = formData.get("is_visible") === "on";
  const imageFile = formData.get("image") as File | null;

  if (type === "text" && !body) {
    throw new Error("本文を入力してください。");
  }

  const image_url = await uploadImageIfProvided(supabase, imageFile);
  if (type === "image" && !image_url) {
    throw new Error("画像を選択してください。");
  }

  const existing = await getAllSectionsForAdmin(locale);
  const position =
    existing.length > 0 ? Math.max(...existing.map((s) => s.position)) + 1 : 0;

  const { error } = await supabase.from("page_sections").insert({
    page: "home",
    locale,
    type,
    position,
    is_visible: isVisible,
    title: type === "text" ? title : null,
    body: type === "text" ? body : null,
    image_url: type === "image" ? image_url : null,
    image_alt: type === "image" ? imageAlt : null,
    caption: type === "image" ? caption : null,
  });

  if (error) throw new Error(error.message);

  revalidateHome(locale);
  redirect(`/admin/home?locale=${locale}`);
}

export async function updateSection(id: string, formData: FormData) {
  const existingSection = await getSectionByIdForAdmin(id);
  if (!existingSection) throw new Error("セクションが見つかりません。");

  const supabase = await createClient();

  const { locale, type } = existingSection;
  const title = String(formData.get("title") ?? "").trim() || null;
  const body = String(formData.get("body") ?? "").trim() || null;
  const imageAlt = String(formData.get("image_alt") ?? "").trim() || null;
  const caption = String(formData.get("caption") ?? "").trim() || null;
  const isVisible = formData.get("is_visible") === "on";
  const imageFile = formData.get("image") as File | null;
  const existingImageUrl =
    String(formData.get("existing_image_url") ?? "") || null;

  if (type === "text" && !body) {
    throw new Error("本文を入力してください。");
  }

  const uploadedUrl = await uploadImageIfProvided(supabase, imageFile);
  const image_url = uploadedUrl ?? existingImageUrl;
  if (type === "image" && !image_url) {
    throw new Error("画像を選択してください。");
  }

  const { error } = await supabase
    .from("page_sections")
    .update({
      is_visible: isVisible,
      title: type === "text" ? title : null,
      body: type === "text" ? body : null,
      image_url: type === "image" ? image_url : null,
      image_alt: type === "image" ? imageAlt : null,
      caption: type === "image" ? caption : null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidateHome(locale);
  redirect(`/admin/home?locale=${locale}`);
}

export async function deleteSection(id: string, locale: PostLocale) {
  const supabase = await createClient();
  const { error } = await supabase.from("page_sections").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateHome(locale);
}

export async function moveSection(id: string, direction: "up" | "down") {
  const section = await getSectionByIdForAdmin(id);
  if (!section) throw new Error("セクションが見つかりません。");

  const siblings = await getAllSectionsForAdmin(section.locale);
  const index = siblings.findIndex((s) => s.id === id);
  const targetIndex = direction === "up" ? index - 1 : index + 1;

  if (index === -1 || targetIndex < 0 || targetIndex >= siblings.length) {
    return;
  }

  const target = siblings[targetIndex];
  const supabase = await createClient();

  const { error: error1 } = await supabase
    .from("page_sections")
    .update({ position: target.position })
    .eq("id", section.id);
  const { error: error2 } = await supabase
    .from("page_sections")
    .update({ position: section.position })
    .eq("id", target.id);

  if (error1) throw new Error(error1.message);
  if (error2) throw new Error(error2.message);

  revalidateHome(section.locale);
}
