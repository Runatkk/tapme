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
