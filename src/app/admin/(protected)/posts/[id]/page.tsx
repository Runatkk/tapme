import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostByIdForAdmin } from "@/lib/posts";
import { PostForm } from "../post-form";
import { updatePost } from "../actions";

export const metadata: Metadata = {
  title: "記事編集",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const post = await getPostByIdForAdmin(id);

  if (!post) notFound();

  const updatePostWithId = updatePost.bind(null, post.id);

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">記事編集</h1>
      <PostForm action={updatePostWithId} initialPost={post} />
    </div>
  );
}
