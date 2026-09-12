export type PostStatus = "draft" | "published";

export interface Post {
  id: string;
  title: string;
  slug: string;
  body: string;
  thumbnail_url: string | null;
  status: PostStatus;
  created_at: string;
  updated_at: string;
}
