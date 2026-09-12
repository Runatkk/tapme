import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-black/10 py-6">
      <div className="mx-auto max-w-3xl px-4 text-center text-xs text-black/50 sm:px-6">
        © {new Date().getFullYear()} {siteConfig.name}
      </div>
    </footer>
  );
}
