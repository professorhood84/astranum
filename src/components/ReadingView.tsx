import { PLANET_CONTENT } from "@/lib/content/planets";
import { ANIMAL_CONTENT } from "@/lib/content/animals";
import { ordinal, type Reading } from "@/lib/reading";
import { SIGN_GLYPH } from "@/lib/zodiac";

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-lilac/15 bg-card/50 p-6 sm:p-8">
      <h2 className="font-display text-xl text-white">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-lilac/70">{subtitle}</p>}
      <div className="mt-5 space-y-4 leading-relaxed text-lilac">{children}</div>
    </section>
  );
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-lilac/15 bg-ink-soft/70 px-4 py-3 text-center">
      <p className="text-[0.68rem] uppercase tracking-[0.14em] text-lilac/70">
        {label}
      </p>
      <p className="mt-1 font-display text-lg text-gold">{value}</p>
    </div>
  );
}

export function ReadingView({ reading }: { reading: Reading }) {
  const chinese = reading.chinese;

  return (
    <div className="space-y-6">
      <Section title={`${reading.firstName}'s reading`} subtitle={new Date(reading.generatedFor).toDateString()}>
        <p className="text-paper">{reading.summary}</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <Chip label="Life Path" value={String(reading.numerology.lifePath)} />
          <Chip label="Sun" value={reading.sun} />
          <Chip label="Moon" value={reading.moon} />
          <Chip label="Rising" value={reading.rising ?? "—"} />
          <Chip
            label="Chinese"
            value={`${chinese.element} ${chinese.animal}`}
          />
        </div>
        {!reading.rising && (
          <p className="rounded-lg border border-gold/30 bg-gold/5 px-4 py-3 text-sm text-paper">
            Add your birth time and city to unlock your Rising sign, your houses,
            and transits to your angles — that&rsquo;s the half of the chart this
            reading is currently missing.
          </p>
        )}
        {reading.moonUncertain && (
          <p className="rounded-lg border border-gold/30 bg-gold/5 px-4 py-3 text-sm text-paper">
            The Moon changed sign on your birth day, from{" "}
            {reading.moonUncertain.first} to {reading.moonUncertain.second}. We
            assumed noon; a birth time would settle which one is yours.
          </p>
        )}
      </Section>

      <Section title="Your chart" subtitle={reading.chartShape}>
        <p>
          <span className="text-white">Sun in {reading.sun}.</span>{" "}
          {reading.sunText}
        </p>
        <p>
          <span className="text-white">Moon in {reading.moon}.</span>{" "}
          {reading.moonText}
        </p>
        {reading.rising && reading.risingText && (
          <p>
            <span className="text-white">{reading.rising} rising.</span>{" "}
            {reading.risingText}
          </p>
        )}
        {reading.midheaven && (
          <p>
            <span className="text-white">Midheaven in {reading.midheaven}.</span>{" "}
            This is the sign the world sees you through when you&rsquo;re working
            — the flavour of the reputation you build.
          </p>
        )}
        <div className="grid gap-2 pt-2 sm:grid-cols-2">
          {reading.placements.map((placement) => (
            <div
              key={placement.planet}
              className="flex items-baseline justify-between rounded-lg border border-lilac/10 bg-ink-soft/60 px-4 py-2.5 text-sm"
            >
              <span className="text-white">
                {PLANET_CONTENT[placement.planet].glyph} {placement.planet}
                {placement.retrograde && (
                  <span className="ml-1.5 text-gold">℞</span>
                )}
              </span>
              <span className="text-lilac/80">
                {placement.formatted} {SIGN_GLYPH[placement.sign]}
                {placement.house && ` · ${ordinal(placement.house)} house`}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Your numbers"
        subtitle={`Life Path ${reading.numerology.lifePath} · Expression ${reading.numerology.expression} · Soul Urge ${reading.numerology.soulUrge} · Personality ${reading.numerology.personality}`}
      >
        <p>
          <span className="text-white">
            Life Path {reading.numerology.lifePath}.
          </span>{" "}
          {reading.numerologyText.lifePath}
        </p>
        <p>{reading.numerologyText.expression}</p>
        <p>{reading.numerologyText.soulUrge}</p>
        <p>{reading.numerologyText.personality}</p>
        <p>{reading.numerologyText.birthday}</p>
      </Section>

      <Section title="Today" subtitle={reading.numerologyText.personalYear}>
        <p>{reading.numerologyText.today}</p>
        {reading.transits.length > 0 ? (
          reading.transits.map((transit) => (
            <div key={transit.headline}>
              <p className="text-white">{transit.headline}</p>
              <p className="mt-1 text-sm">{transit.body}</p>
            </div>
          ))
        ) : (
          <p>
            Nothing in today&rsquo;s sky is within orb of your natal placements.
            Quiet days are for your own agenda rather than reacting to events.
          </p>
        )}
      </Section>

      <Section
        title="Your Chinese zodiac"
        subtitle={`${chinese.polarity} ${chinese.element} ${chinese.animal} · lunisolar year began ${chinese.newYear}`}
      >
        <p>
          {ANIMAL_CONTENT[chinese.animal].glyph} {chinese.profile}
        </p>
        <p>{chinese.elementText}</p>
        <p>
          Your allies are the {chinese.allies.join(", ")}; the {chinese.clash} is
          your traditional opposite.
        </p>
        <p>
          <span className="text-white">
            This is the year of the {chinese.yearElement} {chinese.yearAnimal}.
          </span>{" "}
          {chinese.yearText}
        </p>
      </Section>

      <Section
        title="The sky right now"
        subtitle={`${reading.sky.moonPhase}, ${Math.round(reading.sky.illumination * 100)}% illuminated${reading.sky.retrogrades.length ? ` · retrograde: ${reading.sky.retrogrades.join(", ")}` : ""}`}
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {reading.sky.positions.map((position) => (
            <div
              key={position.planet}
              className="rounded-lg border border-lilac/10 bg-ink-soft/60 px-4 py-2.5 text-sm"
            >
              <p className="text-white">
                {PLANET_CONTENT[position.planet].glyph} {position.planet} in{" "}
                {position.sign} {SIGN_GLYPH[position.sign]}
                {position.retrograde && <span className="ml-1.5 text-gold">℞</span>}
              </p>
              {position.houseMeaning && (
                <p className="mt-0.5 text-xs text-lilac/70">
                  Moving through your {ordinal(position.house!)} house —{" "}
                  {position.houseMeaning}
                </p>
              )}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
