import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPublishedPosts } from "@/lib/posts";
import { getVisibleSections } from "@/lib/sections";
import { HomeSections } from "@/components/HomeSections";
import { buildAlternates } from "@/lib/alternates";
import { headingFont, sourceSans } from "@/components/landing/fonts";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingMission } from "@/components/landing/LandingMission";
import { LandingNews } from "@/components/landing/LandingNews";
import { LandingCta } from "@/components/landing/LandingCta";
import { LandingFooter } from "@/components/landing/LandingFooter";
import type { Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: buildAlternates({ ja: "/ja", en: "/en" }),
  };
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tLanding = await getTranslations("landing");
  const [posts, sections] = await Promise.all([
    getPublishedPosts(locale),
    getVisibleSections(locale),
  ]);

  return (
    <div
      className={`${headingFont.variable} ${sourceSans.variable} flex flex-1 flex-col bg-[#F5F5F7] text-[#1C1B28]`}
      style={{
        fontFamily:
          'var(--font-landing-body), "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", Meiryo, system-ui, sans-serif',
      }}
    >
      <LandingHeader locale={locale} />
      <LandingHero />

      {sections.length > 0 && (
        <div className="mx-auto w-full max-w-3xl px-4 pt-16 sm:px-6">
          <HomeSections sections={sections} />
        </div>
      )}

      <LandingMission />
      <LandingNews
        posts={posts}
        copy={{
          heading: tLanding("news.heading"),
          subheading: tLanding("news.subheading"),
          viewAll: tLanding("news.viewAll"),
          empty: tLanding("news.empty"),
        }}
      />
      <LandingCta />
      <LandingFooter />
    </div>
  );
}
