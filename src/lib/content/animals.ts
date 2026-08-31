import type { Animal, ChineseElement } from "../chinese";

export interface AnimalContent {
  glyph: string;
  traits: string;
  /** Longer read on the personality. */
  profile: string;
}

export const ANIMAL_CONTENT: Record<Animal, AnimalContent> = {
  Rat: {
    glyph: "🐀",
    traits: "quick, resourceful, observant",
    profile:
      "Rats read a situation fast and act on it before it closes. You are adaptable and shrewd with resources, and you keep more of your own counsel than people realise — the sociability is real, but so is the private calculation running underneath it.",
  },
  Ox: {
    glyph: "🐂",
    traits: "steady, patient, unmovable",
    profile:
      "Oxen finish. You work at a pace that looks unhurried right up until you're the only one still standing, and your word is unusually good. The flip side is a stubbornness that costs you when the situation has genuinely changed.",
  },
  Tiger: {
    glyph: "🐅",
    traits: "bold, magnetic, impulsive",
    profile:
      "Tigers move first and think about it after, and get away with it more often than they should. You're courageous and naturally commanding, and the recurring lesson is patience — particularly with people who need longer than you do.",
  },
  Rabbit: {
    glyph: "🐇",
    traits: "diplomatic, refined, cautious",
    profile:
      "Rabbits avoid the fight and usually win anyway. You're gracious, aesthetically sharp, and averse to confrontation — which serves you well socially and occasionally means a problem sits unaddressed longer than it should.",
  },
  Dragon: {
    glyph: "🐉",
    traits: "commanding, confident, ambitious",
    profile:
      "Dragons take up space. You have unusual self-belief and people follow it, which makes you a natural at anything requiring nerve. What you're managing is the gap between the scale of your vision and other people's willingness to keep up.",
  },
  Snake: {
    glyph: "🐍",
    traits: "perceptive, private, strategic",
    profile:
      "Snakes see more than they say. You think in long arcs and reveal your position late, which makes you formidable in anything strategic. Trust comes slowly and, once broken, doesn't rebuild.",
  },
  Horse: {
    glyph: "🐎",
    traits: "energetic, independent, restless",
    profile:
      "Horses need somewhere to run. You're warm, quick, and allergic to confinement, and you'd rather leave a good situation than be held in place by it. Following through past the exciting part is your work.",
  },
  Goat: {
    glyph: "🐐",
    traits: "gentle, artistic, sensitive",
    profile:
      "Goats create the conditions others enjoy. You're empathetic and aesthetically gifted, more comfortable supporting than commanding, and you need reassurance more than you tend to ask for.",
  },
  Monkey: {
    glyph: "🐒",
    traits: "inventive, playful, sharp",
    profile:
      "Monkeys solve it sideways. You're mentally fast and endlessly curious, and you get bored by anything that stays solved. Discipline, not ability, is your limiting factor.",
  },
  Rooster: {
    glyph: "🐓",
    traits: "precise, candid, hardworking",
    profile:
      "Roosters notice the detail everyone else skipped. You're organised, direct, and unafraid to say the thing — which people value more in hindsight than in the moment. Perfectionism is the tax you pay.",
  },
  Dog: {
    glyph: "🐕",
    traits: "loyal, principled, protective",
    profile:
      "Dogs stand by people. You have a strong sense of fairness and you'll take a personal cost to defend it, and your loyalty runs deeper than most. The worry that comes with caring that much is the part to watch.",
  },
  Pig: {
    glyph: "🐖",
    traits: "generous, sincere, tolerant",
    profile:
      "Pigs give people the benefit of the doubt, and mostly it works. You're warm, honest, and comfortable with pleasure in a way that others envy. Occasionally your generosity gets spent on people who won't return it.",
  },
};

export const ELEMENT_CONTENT: Record<ChineseElement, string> = {
  Wood: "Wood adds growth and flexibility — expansive, cooperative, always reaching for the next thing.",
  Fire: "Fire adds heat and visibility — dynamic, passionate, and inclined to lead from the front.",
  Earth: "Earth adds ballast — practical, reliable, and focused on what can actually be built.",
  Metal: "Metal adds edge and resolve — disciplined, determined, and unwilling to bend on principle.",
  Water: "Water adds depth and adaptability — perceptive, persuasive, and able to move around obstacles rather than through them.",
};

export const YEAR_RELATIONSHIP_CONTENT: Record<string, string> = {
  "own-year":
    "This is your ben ming nian — your own animal's year, which tradition treats as a demanding one rather than a lucky one. Years that mirror you back tend to force decisions you've been deferring.",
  clash:
    "This year's animal clashes with yours, the six-year opposition. Read it as friction that reveals what isn't working rather than as bad luck: things that were only just holding together tend to come apart in a clash year.",
  ally: "This year's animal is one of your allies, a naturally supportive pairing. Cooperation comes easily and help arrives from other people more readily than usual.",
  neutral:
    "This year's animal is neutral to yours — no strong pull either way, which historically makes it a good year for steady, self-directed work.",
};
