import type { Metadata } from "next";
import { PostForm } from "../post-form";
import { createPost } from "../actions";

export const metadata: Metadata = {
  title: "新規記事作成",
};

export default function NewPostPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">新規記事作成</h1>
      <PostForm action={createPost} />
    </div>
  );
}
