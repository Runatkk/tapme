"use client";

import { useTransition } from "react";
import { deleteSection, moveSection } from "./actions";
import type { PostLocale } from "@/lib/types";

export function SectionControls({
  id,
  locale,
  isFirst,
  isLast,
}: {
  id: string;
  locale: PostLocale;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        disabled={isPending || isFirst}
        onClick={() => startTransition(() => moveSection(id, "up"))}
        className="rounded border border-black/20 px-2 py-0.5 text-xs disabled:opacity-30"
        aria-label="上に移動"
      >
        ↑
      </button>
      <button
        type="button"
        disabled={isPending || isLast}
        onClick={() => startTransition(() => moveSection(id, "down"))}
        className="rounded border border-black/20 px-2 py-0.5 text-xs disabled:opacity-30"
        aria-label="下に移動"
      >
        ↓
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          if (confirm("このセクションを削除しますか？この操作は取り消せません。")) {
            startTransition(() => deleteSection(id, locale));
          }
        }}
        className="text-sm text-red-600 hover:underline disabled:opacity-50"
      >
        削除
      </button>
    </div>
  );
}
