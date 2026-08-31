import type { Sign } from "../zodiac";

export interface SignContent {
  keyword: string;
  /** How this sign expresses through the Sun — identity and motive. */
  sun: string;
  /** Through the Moon — emotional needs and instincts. */
  moon: string;
  /** On the Ascendant — first impression and default approach. */
  rising: string;
}

export const SIGN_CONTENT: Record<Sign, SignContent> = {
  Aries: {
    keyword: "initiative",
    sun: "You are wired to start things. Momentum is how you think — you understand a situation by moving into it, not by studying it from the outside, and the plans you make sitting still rarely survive contact with your own impatience.",
    moon: "You settle down by doing something about it. Sitting with a feeling is the hardest ask; give yourself a physical outlet and the emotion resolves fast — and it does resolve, rarely lingering once it's been expressed.",
    rising: "You come across as direct and a little ahead of the beat. People read you as decisive before they know whether you've decided anything, which opens doors and occasionally commits you to more than you meant.",
  },
  Taurus: {
    keyword: "steadiness",
    sun: "You build things that last, at the pace they actually take. Your strength is that you don't abandon what you start; the cost is that changing direction takes you longer than it takes almost anyone else.",
    moon: "You need physical security to feel emotionally safe — comfort, routine, a body that's fed and rested. Upheaval hits you in the nervous system before it hits your thoughts.",
    rising: "You present as calm and unhurried, which makes people trust you quickly. They also tend to assume you're more immovable than you are.",
  },
  Gemini: {
    keyword: "curiosity",
    sun: "You think by talking, reading, and connecting one thing to another. Range is your real skill — you pick things up faster than most people can be taught them — and the discipline you're always negotiating with is depth.",
    moon: "You process feelings by putting them into words. Until you've said it out loud or written it down, you don't fully know what you feel; unspoken emotion turns into restlessness.",
    rising: "You come across as quick, light, and interested. People open up to you early, sometimes before you've decided how close you want to be.",
  },
  Cancer: {
    keyword: "care",
    sun: "You orient by belonging — who is yours, and what you're protecting. Your memory for emotional detail is unusually long, which makes you loyal and also makes old injuries stay vivid.",
    moon: "You need a place that's genuinely yours to retreat to. Given that, you're remarkably resilient; without it, small stresses accumulate quickly.",
    rising: "You read as warm and slightly guarded at once. People sense they're being assessed for safety, and they're right.",
  },
  Leo: {
    keyword: "expression",
    sun: "You need your work to have your signature on it. Recognition isn't vanity for you, it's confirmation that what you made actually landed — and you do your best work when someone is watching.",
    moon: "You need to be appreciated out loud. Affection assumed but unspoken doesn't register; say it and you'll give back tenfold.",
    rising: "You have presence before you have volume. People remember meeting you, and they expect you to lead whether you volunteered or not.",
  },
  Virgo: {
    keyword: "refinement",
    sun: "You improve things. You notice the gap between how something is and how it could be, and that noticing is both your contribution and the source of your restlessness — the standard you hold others to is the softer version of the one you hold yourself to.",
    moon: "You feel steady when things are in order and useful. Being of practical help is genuinely how you show care, and anxiety is what unspent problem-solving turns into.",
    rising: "You present as competent and observant, a little reserved until you've taken the measure of the room. People bring you their problems early.",
  },
  Libra: {
    keyword: "balance",
    sun: "You think in relation — every decision gets weighed against its effect on other people. That makes you fair and unusually good at seeing all sides, and it makes committing to one side genuinely costly.",
    moon: "You need harmony around you to feel settled. Unresolved conflict sits in you long after the other person has forgotten it.",
    rising: "You come across as gracious and easy to be around. It works so well that people rarely notice how much of your own preference you've filed down to make it work.",
  },
  Scorpio: {
    keyword: "depth",
    sun: "You go all the way in or not at all. You're built for the things other people avoid — the real conversation, the actual number, the buried motive — and half-measures read as dishonesty to you.",
    moon: "You feel intensely and privately. Trust is given slowly and completely, and betrayal of it isn't something you get over by talking it through.",
    rising: "You read as self-contained and hard to categorize. People find you compelling and are never quite sure what you're thinking, which is roughly how you like it.",
  },
  Sagittarius: {
    keyword: "expansion",
    sun: "You need the horizon to keep moving. Meaning matters more to you than security — you'll trade a comfortable arrangement for one that teaches you something, and you'll do it more than once.",
    moon: "You need room. Emotional claustrophobia is your worst state, and the instinct when it hits is to go somewhere, literally or otherwise.",
    rising: "You come across as open, frank, and up for it. Your honesty is refreshing until it isn't, and you usually find out which a beat late.",
  },
  Capricorn: {
    keyword: "structure",
    sun: "You play the long game. You're comfortable with delayed reward in a way most people aren't, which is why you tend to end up carrying real responsibility — and why rest can feel like something you have to earn.",
    moon: "You feel safe when you're in control of your circumstances. Competence is your comfort; needing help is the thing you'll do last.",
    rising: "You present as serious and reliable, often older than you are. People hand you authority without being asked.",
  },
  Aquarius: {
    keyword: "perspective",
    sun: "You see the system, not just the situation. You're loyal to the principle rather than the crowd, which makes you the one willing to say the unpopular true thing — and occasionally the one arguing a position no one else is in the room for.",
    moon: "You need intellectual space and a bit of distance to feel your feelings. Pressed for immediate emotional access, you go cool; given room, you come back.",
    rising: "You read as distinctive and slightly outside the group. People are curious about you before they're close to you.",
  },
  Pisces: {
    keyword: "attunement",
    sun: "You absorb the atmosphere around you and turn it into something — art, empathy, insight. Your boundaries are permeable, which is the source of both your best work and most of your exhaustion.",
    moon: "You feel other people's states as if they were your own. Solitude isn't a luxury for you; it's how you find out which of the feelings were yours.",
    rising: "You come across as gentle and hard to pin down. People soften around you, and they project onto you generously.",
  },
};
