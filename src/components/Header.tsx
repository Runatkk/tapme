import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function Header() {
  return (
    <header className="border-b border-black/10 bg-white/80 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-bold tracking-tight">
          {siteConfig.name}
        </Link>
        <nav className="flex gap-4 text-sm">
          <Link href="/" className="hover:underline">
            Top
          </Link>
          <Link href="/posts" className="hover:underline">
            記事一覧
          </Link>
        </nav>
      </div>
    </header>
  );
}
