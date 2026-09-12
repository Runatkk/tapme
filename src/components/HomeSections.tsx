import Image from "next/image";
import { MarkdownContent } from "@/components/MarkdownContent";
import type { PageSection } from "@/lib/types";

export function HomeSections({ sections }: { sections: PageSection[] }) {
  if (sections.length === 0) return null;

  return (
    <div className="mb-12 flex flex-col gap-10">
      {sections.map((section) =>
        section.type === "text" ? (
          <section key={section.id}>
            {section.title && (
              <h2 className="mb-3 text-xl font-semibold">{section.title}</h2>
            )}
            {section.body && <MarkdownContent body={section.body} />}
          </section>
        ) : (
          <figure key={section.id}>
            {section.image_url && (
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black/5">
                <Image
                  src={section.image_url}
                  alt={section.image_alt ?? ""}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                />
              </div>
            )}
            {section.caption && (
              <figcaption className="mt-2 text-center text-sm text-black/50">
                {section.caption}
              </figcaption>
            )}
          </figure>
        ),
      )}
    </div>
  );
}
