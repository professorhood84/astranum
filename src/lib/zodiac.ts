export const SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
] as const;

export type Sign = (typeof SIGNS)[number];

export type Element = "Fire" | "Earth" | "Air" | "Water";
export type Modality = "Cardinal" | "Fixed" | "Mutable";

export const SIGN_ELEMENT: Record<Sign, Element> = {
  Aries: "Fire",
  Taurus: "Earth",
  Gemini: "Air",
  Cancer: "Water",
  Leo: "Fire",
  Virgo: "Earth",
  Libra: "Air",
  Scorpio: "Water",
  Sagittarius: "Fire",
  Capricorn: "Earth",
  Aquarius: "Air",
  Pisces: "Water",
};

export const SIGN_MODALITY: Record<Sign, Modality> = {
  Aries: "Cardinal",
  Taurus: "Fixed",
  Gemini: "Mutable",
  Cancer: "Cardinal",
  Leo: "Fixed",
  Virgo: "Mutable",
  Libra: "Cardinal",
  Scorpio: "Fixed",
  Sagittarius: "Mutable",
  Capricorn: "Cardinal",
  Aquarius: "Fixed",
  Pisces: "Mutable",
};

export const SIGN_RULER: Record<Sign, string> = {
  Aries: "Mars",
  Taurus: "Venus",
  Gemini: "Mercury",
  Cancer: "Moon",
  Leo: "Sun",
  Virgo: "Mercury",
  Libra: "Venus",
  Scorpio: "Pluto",
  Sagittarius: "Jupiter",
  Capricorn: "Saturn",
  Aquarius: "Uranus",
  Pisces: "Neptune",
};

export const SIGN_GLYPH: Record<Sign, string> = {
  Aries: "♈",
  Taurus: "♉",
  Gemini: "♊",
  Cancer: "♋",
  Leo: "♌",
  Virgo: "♍",
  Libra: "♎",
  Scorpio: "♏",
  Sagittarius: "♐",
  Capricorn: "♑",
  Aquarius: "♒",
  Pisces: "♓",
};

export function normalizeDegrees(deg: number): number {
  const d = deg % 360;
  return d < 0 ? d + 360 : d;
}

export function signFromLongitude(longitude: number): Sign {
  return SIGNS[Math.floor(normalizeDegrees(longitude) / 30)];
}

export function degreeInSign(longitude: number): number {
  return normalizeDegrees(longitude) % 30;
}

/** "12°34′ Leo" */
export function formatLongitude(longitude: number): string {
  const inSign = degreeInSign(longitude);
  const deg = Math.floor(inSign);
  const min = Math.floor((inSign - deg) * 60);
  return `${deg}°${String(min).padStart(2, "0")}′ ${signFromLongitude(longitude)}`;
}

/** Shortest angular separation between two longitudes, in [0, 180]. */
export function angularSeparation(a: number, b: number): number {
  const diff = Math.abs(normalizeDegrees(a) - normalizeDegrees(b)) % 360;
  return diff > 180 ? 360 - diff : diff;
}
