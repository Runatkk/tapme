import { getTranslations } from "next-intl/server";
import { GlobeIcon, ScaleIcon, ShieldIcon } from "./icons";

const ICONS = [GlobeIcon, ScaleIcon, ShieldIcon];

type MissionCard = { title: string; description: string };

export async function LandingMission() {
  const t = await getTranslations("landing.mission");
  const cards = t.raw("cards") as MissionCard[];

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <p className="text-xs font-semibold tracking-[0.2em] text-[#2D2170]">
        {t("eyebrow")}
      </p>
      <h2
        className="mt-3 max-w-4xl text-2xl font-semibold leading-snug text-[#1C1B28] sm:text-3xl"
        style={{
          fontFamily:
            'var(--font-landing-heading), "Hiragino Mincho ProN", "Yu Mincho", Georgia, serif',
        }}
      >
        {t("heading")}
      </h2>
      <p className="mt-4 max-w-3xl text-sm text-[#6F6E80]">{t("subheading")}</p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {cards.map((card, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <div
              key={card.title}
              className="rounded-lg bg-[#F7F7F9] p-6"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#E9E9F4] text-[#2D2170]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-[#1C1B28]">
                {card.title}
              </h3>
              <p className="text-sm text-[#6F6E80]">{card.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
