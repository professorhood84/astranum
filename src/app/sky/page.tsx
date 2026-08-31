import type { Metadata } from "next";
import Link from "next/link";

import { moonPhase, skyNow } from "@/lib/chart";
import { PLANET_CONTENT } from "@/lib/content/planets";
import { SIGN_CONTENT } from "@/lib/content/signs";
import { SIGN_GLYPH, SIGN_ELEMENT } from "@/lib/zodiac";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Today's Sky — Astranum",
  description:
    "Where every planet is right now, which are retrograde, the Moon's phase, and the aspects between them — computed live, not written in advance.",
};

export default function SkyPage() {
  const now = new Date();
  const sky = skyNow(now);
  const phase = moonPhase(now);

  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="font-display text-3xl text-white sm:text-4xl">
        Today&rsquo;s sky
      </h1>
      <p className="mt-3 text-lilac">
        {now.toUTCString().slice(0, 16)} · {phase.phase},{" "}
        {Math.round(phase.illumination * 100)}% illuminated. Every position below
        is calculated when you load the page.
      </p>

      <div className="mt-8 space-y-3">
        {sky.planets.map((planet) => (
          <div
            key={planet.name}
            className="rounded-xl border border-lilac/15 bg-card/50 px-5 py-4"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-display text-lg text-white">
                {PLANET_CONTENT[planet.name].glyph} {planet.name} in{" "}
                {planet.sign} {SIGN_GLYPH[planet.sign]}
                {planet.retrograde && (
                  <span className="ml-2 text-sm text-gold">retrograde</span>
                )}
              </p>
              <p className="text-sm text-lilac/70">
                {planet.degreeInSign.toFixed(1)}° · {SIGN_ELEMENT[planet.sign]}
              </p>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-lilac">
              {planet.name} governs {PLANET_CONTENT[planet.name].governs}, and
              spends {PLANET_CONTENT[planet.name].pace}. In {planet.sign}, that
              takes on {SIGN_CONTENT[planet.sign].keyword}.
              {planet.retrograde && ` ${PLANET_CONTENT[planet.name].retrograde}`}
            </p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 font-display text-2xl text-white">
        Aspects in the sky today
      </h2>
      <div className="mt-4 space-y-2">
        {sky.aspects.slice(0, 10).map((aspect) => (
          <p
            key={`${aspect.a}-${aspect.b}-${aspect.name}`}
            className="rounded-lg border border-lilac/10 bg-ink-soft/60 px-4 py-2.5 text-sm text-lilac"
          >
            <span className="text-white">
              {aspect.a} {aspect.name} {aspect.b}
            </span>{" "}
            · {aspect.orb.toFixed(1)}° orb,{" "}
            {aspect.applying ? "applying" : "separating"}
          </p>
        ))}
      </div>

      <p className="mt-10 text-lilac">
        <Link href="/reading" className="text-gold underline">
          Get your reading
        </Link>{" "}
        to see what today&rsquo;s sky is doing to your chart specifically.
      </p>
    </main>
  );
}
