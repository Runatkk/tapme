import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSectionByIdForAdmin } from "@/lib/sections";
import { SectionForm } from "../section-form";
import { updateSection } from "../actions";

export const metadata: Metadata = {
  title: "セクション編集",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditSectionPage({ params }: Props) {
  const { id } = await params;
  const section = await getSectionByIdForAdmin(id);

  if (!section) notFound();

  const updateSectionWithId = updateSection.bind(null, section.id);

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">セクション編集</h1>
      <SectionForm
        action={updateSectionWithId}
        locale={section.locale}
        type={section.type}
        initialSection={section}
      />
    </div>
  );
}
