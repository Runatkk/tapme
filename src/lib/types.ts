export type PostStatus = "draft" | "published";
export type PostLocale = "ja" | "en";

export interface Post {
  id: string;
  title: string;
  slug: string;
  body: string;
  thumbnail_url: string | null;
  status: PostStatus;
  locale: PostLocale;
  translation_group_id: string;
  created_at: string;
  updated_at: string;
}

export type SectionType = "text" | "image";

export interface PageSection {
  id: string;
  page: "home";
  locale: PostLocale;
  type: SectionType;
  position: number;
  is_visible: boolean;
  title: string | null;
  body: string | null;
  image_url: string | null;
  image_alt: string | null;
  caption: string | null;
  created_at: string;
  updated_at: string;
}
