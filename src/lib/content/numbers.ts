export interface NumberContent {
  title: string;
  /** Core meaning, used for Life Path and Expression. */
  core: string;
  /** What this number wants, used for Soul Urge. */
  desire: string;
  /** How it reads from outside, used for Personality. */
  impression: string;
  /** The theme of a year, month or day carrying this number. */
  cycle: string;
}

export const NUMBER_CONTENT: Record<number, NumberContent> = {
  1: {
    title: "The Initiator",
    core: "Independence and origination. You're here to lead your own way rather than improve someone else's, and the recurring lesson is that self-reliance shouldn't harden into refusing help.",
    desire: "to be your own authority and to do it first",
    impression: "self-directed, a bit of a lone operator",
    cycle: "A beginning. Whatever you plant now sets the tone for the nine-year cycle that follows, so start the thing rather than researching it.",
  },
  2: {
    title: "The Diplomat",
    core: "Partnership and sensitivity. You perceive what other people need before they say it, which makes you invaluable in pairs and teams — and makes it easy to lose track of what you wanted.",
    desire: "peace, closeness, and to be genuinely met",
    impression: "gentle, considerate, easy to be around",
    cycle: "A year of patience and partnership. Progress comes through other people and through waiting well, not through force.",
  },
  3: {
    title: "The Communicator",
    core: "Expression and imagination. Your ideas want an audience, and you're at your best when you're making something with a voice in it; the discipline is finishing what the enthusiasm started.",
    desire: "to be heard, and to enjoy the making of things",
    impression: "warm, expressive, entertaining",
    cycle: "A visible, social, creative year. Say yes to what puts your work in front of people; guard against scattering across too many projects.",
  },
  4: {
    title: "The Builder",
    core: "Structure and endurance. You make things that hold — systems, businesses, families — through consistency rather than brilliance, and the shadow side is rigidity when the plan needs to change.",
    desire: "security, order, and something solid to stand on",
    impression: "dependable, grounded, no-nonsense",
    cycle: "A year of foundations and hard work. Unglamorous and cumulative; what you organise now is what everything later rests on.",
  },
  5: {
    title: "The Explorer",
    core: "Freedom and change. You learn by variety and direct experience, and you need a life with movement in it; the lesson is choosing which freedoms to trade for the things that require staying.",
    desire: "movement, novelty, and no locked doors",
    impression: "adaptable, magnetic, hard to pin down",
    cycle: "A year of change and unexpected doors. Stay flexible and don't over-commit; the plan you make in January will not be the year you get.",
  },
  6: {
    title: "The Caretaker",
    core: "Responsibility and care. People rely on you, often more than they realise, and your sense of purpose comes from what you're holding together — provided you don't take on what isn't yours.",
    desire: "to be needed by people you love",
    impression: "nurturing, responsible, the one who hosts",
    cycle: "A year centred on home, family, and obligation. Relationships deepen or resolve; things you've been carrying come to a head.",
  },
  7: {
    title: "The Seeker",
    core: "Analysis and inwardness. You need to understand things at the root, and you need solitude to do it; the risk is mistaking distance for safety and staying there.",
    desire: "truth, and enough quiet to find it",
    impression: "thoughtful, private, hard to read",
    cycle: "A quieter, more inward year. Study, rest, and reassessment pay off; pushing for external results mostly doesn't.",
  },
  8: {
    title: "The Executive",
    core: "Power and material mastery. You're built to handle scale — money, authority, consequence — and the recurring test is whether you're using that capacity or being used by it.",
    desire: "achievement, resources, and control of your own outcomes",
    impression: "capable, ambitious, someone in charge",
    cycle: "A year of results and money matters. Effort from earlier in the cycle pays out now, and so do any shortcuts you took.",
  },
  9: {
    title: "The Humanitarian",
    core: "Completion and compassion. You see the wider picture and you're at your best in service of something larger than yourself; the work is letting go of what's finished.",
    desire: "to give something back and to leave things better",
    impression: "warm, worldly, a little idealistic",
    cycle: "A year of endings and release. Clear out what's done rather than starting something new — next year is the beginning.",
  },
  11: {
    title: "The Illuminator",
    core: "The master number of intuition. You get the 2's sensitivity turned up to the point of being a channel — insight arrives whole and unexplained, and living with a nervous system that open is the real assignment.",
    desire: "to be inspired, and to inspire others with what you see",
    impression: "unusual, perceptive, a bit electric",
    cycle: "A year of heightened intuition and visibility. Pay attention to what keeps arriving unbidden.",
  },
  22: {
    title: "The Master Builder",
    core: "The 4's craft applied at scale. You can turn a vision into a working structure that outlasts you — the largest capacity in the system, and the one that most requires you to actually start.",
    desire: "to build something real and lasting out of an idea",
    impression: "formidable, practical, quietly ambitious",
    cycle: "A year for building at scale. Aim higher than feels reasonable, then do the unglamorous work.",
  },
  33: {
    title: "The Master Teacher",
    core: "The 6's care raised to a vocation. Rare, and demanding: it asks for service given freely and without the martyrdom that usually accompanies it.",
    desire: "to heal and to teach, without needing credit",
    impression: "generous, steady, someone people confide in",
    cycle: "A year of teaching and care. What you give away comes back in a form you didn't plan for.",
  },
};

export const BIRTHDAY_CONTENT: Record<number, string> = {
  1: "a natural starter",
  2: "a natural collaborator",
  3: "a natural communicator",
  4: "a natural organiser",
  5: "a natural improviser",
  6: "a natural caretaker",
  7: "a natural analyst",
  8: "a natural operator",
  9: "a natural giver",
  10: "a self-starter with staying power",
  11: "intuitive to the point of being unnerving",
  12: "creative with a practical streak",
  13: "a grinder who builds through discipline",
  14: "restless, and best when the work keeps changing",
  15: "warm, magnetic, and responsible for people",
  16: "introspective, with an analytical edge",
  17: "ambitious and self-contained",
  18: "big-hearted and capable of scale",
  19: "independent, and eventually the one in charge",
  20: "sensitive, and strongest in partnership",
  21: "expressive and socially quick",
  22: "a builder with an unusually long horizon",
  23: "adaptable and persuasive",
  24: "devoted, domestic, and steady",
  25: "analytical and quietly intense",
  26: "practical, with real commercial instincts",
  27: "compassionate and worldly",
  28: "a leader who works best with a partner",
  29: "intuitive, with a public role in it somewhere",
  30: "expressive, creative, and hard to keep quiet",
  31: "a builder with an artistic streak",
};
