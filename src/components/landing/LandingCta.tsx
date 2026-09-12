import { getTranslations } from "next-intl/server";

export async function LandingCta() {
  const t = await getTranslations("landing.cta");

  return (
    <section id="contact" className="bg-[#2D2170] px-4 py-20 text-center sm:px-6">
      <h2
        className="mx-auto max-w-2xl text-2xl font-semibold text-white sm:text-3xl"
        style={{
          fontFamily:
            'var(--font-landing-heading), "Hiragino Mincho ProN", "Yu Mincho", Georgia, serif',
        }}
      >
        {t("heading")}
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-sm text-white/80">
        {t("subheading")}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          className="rounded-[4px] bg-white px-6 py-3 text-sm font-medium text-[#2D2170] hover:opacity-90"
        >
          {t("primary")}
        </button>
        <button
          type="button"
          className="rounded-[4px] border border-white/40 px-6 py-3 text-sm font-medium text-white hover:bg-white/10"
        >
          {t("secondary")}
        </button>
      </div>
    </section>
  );
}
