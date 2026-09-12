import Link from "next/link";
import { logout } from "./actions";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black/[.02]">
      <div className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/admin/posts" className="font-bold">
              管理画面
            </Link>
            <nav className="flex gap-4 text-sm text-black/60">
              <Link href="/admin/posts" className="hover:text-black">
                記事
              </Link>
              <Link href="/admin/home" className="hover:text-black">
                ホーム編集
              </Link>
            </nav>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm text-black/60 hover:underline"
            >
              ログアウト
            </button>
          </form>
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
