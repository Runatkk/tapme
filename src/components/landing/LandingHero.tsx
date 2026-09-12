import Image from "next/image";
import { getTranslations } from "next-intl/server";

export async function LandingHero() {
  const t = await getTranslations("landing.hero");

  return (
    <section
      id="top"
      className="relative mx-auto mt-6 max-w-6xl overflow-hidden rounded-2xl px-4 sm:px-6"
    >
      <div className="relative flex min-h-[420px] flex-col items-center justify-center gap-6 overflow-hidden rounded-2xl px-6 py-20 text-center text-white">
        <Image
          src="/landing-hero.jpg"
          alt=""
          fill
          priority
          sizes="(max-width: 1152px) 100vw, 1152px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#2D2170]/55" />

        <h1
          className="relative max-w-3xl text-2xl font-semibold leading-snug sm:text-3xl"
          style={{
            fontFamily:
              'var(--font-landing-heading), "Hiragino Mincho ProN", "Yu Mincho", Georgia, serif',
          }}
        >
          {t("title")}
        </h1>
        <p className="relative max-w-2xl text-sm text-white/90 sm:text-base">
          {t("subtitleLine1")}
          <br />
          {t("subtitleLine2")}
          <br />
          {t("subtitleLine3")}
        </p>
        <div className="relative mt-4 flex flex-wrap justify-center gap-3">
          <a
            href="#academy"
            className="rounded-[4px] bg-[#2D2170] px-6 py-3 text-sm font-medium text-white ring-1 ring-white/30 hover:opacity-90"
          >
            {t("primaryCta")}
          </a>
          <a
            href="#advisory"
            className="rounded-[4px] bg-white px-6 py-3 text-sm font-medium text-[#2D2170] hover:opacity-90"
          >
            {t("secondaryCta")}
          </a>
        </div>
      </div>
    </section>
  );
}
