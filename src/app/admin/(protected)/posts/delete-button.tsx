"use client";

import { useTransition } from "react";
import { deletePost } from "./actions";

export function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (confirm("この記事を削除しますか？この操作は取り消せません。")) {
          startTransition(() => {
            deletePost(id);
          });
        }
      }}
      className="text-sm text-red-600 hover:underline disabled:opacity-50"
    >
      削除
    </button>
  );
}
