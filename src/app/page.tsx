import Link from "next/link";

import { moonPhase, skyNow } from "@/lib/chart";
import { PLANET_CONTENT } from "@/lib/content/planets";
import { SIGN_GLYPH } from "@/lib/zodiac";

// The sky changes; the landing page should too.
export const revalidate = 900;

export default function Home() {
  const now = new Date();
  const sky = skyNow(now);
  const phase = moonPhase(now);
  const retrogrades = sky.planets.filter((p) => p.retrograde);

  return (
    <main className="mx-auto max-w-5xl px-6">
      <section className="py-20 text-center sm:py-28">
        <span className="inline-block rounded-full border border-gold/40 px-4 py-1.5 text-xs uppercase tracking-[0.16em] text-gold">
          Live now · Your first reading is free
        </span>
        <h1 className="mt-7 font-display text-4xl leading-tight text-white sm:text-6xl">
          Your stars, your numbers,
          <br />
          one personal reading
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-lilac">
          Astranum reads your real birth chart — the actual positions of the
          planets at the moment and place you were born — alongside your
          numerology and Chinese zodiac, and tells you what today&rsquo;s sky is
          doing to <em>your</em> chart specifically.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link
            href="/reading"
            className="rounded-full bg-gold px-7 py-3 font-medium text-ink transition hover:bg-gold/90"
          >
            Get your free reading
          </Link>
          <Link
            href="/sky"
            className="rounded-full border border-lilac/40 px-7 py-3 text-paper transition hover:border-gold hover:text-gold"
          >
            See today&rsquo;s sky
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-lilac/15 bg-card/60 p-7">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-display text-xl text-white">The sky right now</h2>
          <p className="text-sm text-lilac/80">
            {now.toUTCString().slice(0, 22)} UTC · computed on load, never
            hardcoded
          </p>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sky.planets.map((planet) => (
            <div
              key={planet.name}
              className="flex items-center gap-3 rounded-xl border border-lilac/10 bg-ink-soft/70 px-4 py-3"
            >
              <span className="text-xl text-gold">
                {PLANET_CONTENT[planet.name].glyph}
              </span>
              <div>
                <p className="text-sm text-white">
                  {planet.name} in {planet.sign} {SIGN_GLYPH[planet.sign]}
                  {planet.retrograde && (
                    <span className="ml-2 text-xs text-gold">℞</span>
                  )}
                </p>
                <p className="text-xs text-lilac/70">
                  {planet.degreeInSign.toFixed(1)}° · {PLANET_CONTENT[planet.name].pace}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-5 text-sm text-lilac">
          {phase.phase}, {Math.round(phase.illumination * 100)}% illuminated.
          {retrogrades.length > 0
            ? ` Retrograde today: ${retrogrades.map((p) => p.name).join(", ")}.`
            : " No planets are retrograde today."}
        </p>
      </section>

      <section className="grid gap-5 py-20 sm:grid-cols-3">
        {[
          {
            glyph: "✦",
            title: "A real chart, not a sun sign",
            body: "Give a birth time and place and you get your Moon, your Rising sign, all ten planets by house, and the aspects between them — calculated to arc-minute precision for your exact moment.",
          },
          {
            glyph: "✳",
            title: "Numerology with the working shown",
            body: "Life Path, Expression, Soul Urge, Personality, and your Personal Year, Month and Day — each one explained in terms of what it's derived from, not just asserted.",
          },
          {
            glyph: "☯",
            title: "Chinese zodiac, boundary handled",
            body: "Your animal year is resolved against the actual Chinese New Year date for your birth year, computed from the lunar cycle — no guessing if you were born in late January.",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-lilac/15 bg-card/40 p-6"
          >
            <p className="text-2xl text-gold">{card.glyph}</p>
            <h3 className="mt-3 font-display text-lg text-white">{card.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-lilac">{card.body}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
