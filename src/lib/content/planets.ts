import type { PlanetName } from "../chart";

export interface PlanetContent {
  glyph: string;
  /** What area of life this planet describes. */
  governs: string;
  /** How long it stays in one sign, used to explain why it matters today. */
  pace: string;
  /** What it means when this planet is retrograde. */
  retrograde: string;
}

export const PLANET_CONTENT: Record<PlanetName, PlanetContent> = {
  Sun: {
    glyph: "☉",
    governs: "identity, vitality, and what you are consciously trying to become",
    pace: "about a month in each sign",
    retrograde: "",
  },
  Moon: {
    glyph: "☽",
    governs: "moods, instincts, and what you need in order to feel safe",
    pace: "two to three days in each sign",
    retrograde: "",
  },
  Mercury: {
    glyph: "☿",
    governs: "thinking, speech, negotiation, and everything written down",
    pace: "roughly three weeks in each sign",
    retrograde:
      "Plans made now get revised. It is a better stretch for finishing, editing, and re-reading the contract than for signing it.",
  },
  Venus: {
    glyph: "♀",
    governs: "attraction, taste, money, and how you relate",
    pace: "about a month in each sign",
    retrograde:
      "Old relationships and old questions of worth resurface. Not a natural moment for new commitments; a very good one for re-evaluating existing ones.",
  },
  Mars: {
    glyph: "♂",
    governs: "drive, anger, appetite, and how you go after what you want",
    pace: "six to seven weeks in each sign",
    retrograde:
      "Energy turns inward and forward motion stalls. Pushing harder backfires; this is the stretch for regrouping.",
  },
  Jupiter: {
    glyph: "♃",
    governs: "growth, opportunity, belief, and where you are being generous",
    pace: "about a year in each sign",
    retrograde:
      "Growth turns internal. The opportunity is still there, but it wants examining rather than seizing.",
  },
  Saturn: {
    glyph: "♄",
    governs: "limits, discipline, and the work that takes years",
    pace: "two and a half years in each sign",
    retrograde:
      "The pressure comes from inside rather than from circumstance. Structures built carelessly show their cracks now.",
  },
  Uranus: {
    glyph: "♅",
    governs: "disruption, independence, and the parts of life that change suddenly",
    pace: "about seven years in each sign",
    retrograde:
      "The urge to break out is felt privately before it is acted on.",
  },
  Neptune: {
    glyph: "♆",
    governs: "imagination, ideals, and where the picture is blurry",
    pace: "about fourteen years in each sign",
    retrograde:
      "Illusions get harder to maintain. Clarity returns, sometimes uncomfortably.",
  },
  Pluto: {
    glyph: "♇",
    governs: "power, obsession, and slow irreversible change",
    pace: "twelve to twenty years in each sign",
    retrograde:
      "The transformation moves underground and works on you rather than through you.",
  },
};

export const HOUSE_MEANING: Record<number, string> = {
  1: "your body, your presence, and how you start things",
  2: "money, possessions, and your sense of your own worth",
  3: "daily communication, siblings, short trips, and learning",
  4: "home, family, and your private foundations",
  5: "creativity, play, romance, and children",
  6: "work, routine, health, and service",
  7: "partnership, one-to-one relationships, and open opposition",
  8: "shared resources, intimacy, debt, and transformation",
  9: "travel, higher study, publishing, and belief",
  10: "career, reputation, and your public role",
  11: "friendships, networks, and long-range hopes",
  12: "solitude, the unconscious, and what happens behind the scenes",
};
