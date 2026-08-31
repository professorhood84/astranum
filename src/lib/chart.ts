import * as Astronomy from "astronomy-engine";

import {
  angularSeparation,
  degreeInSign,
  normalizeDegrees,
  signFromLongitude,
  type Sign,
} from "./zodiac";

export const PLANETS = [
  "Sun",
  "Moon",
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
  "Uranus",
  "Neptune",
  "Pluto",
] as const;

export type PlanetName = (typeof PLANETS)[number];

const BODY: Record<PlanetName, Astronomy.Body> = {
  Sun: Astronomy.Body.Sun,
  Moon: Astronomy.Body.Moon,
  Mercury: Astronomy.Body.Mercury,
  Venus: Astronomy.Body.Venus,
  Mars: Astronomy.Body.Mars,
  Jupiter: Astronomy.Body.Jupiter,
  Saturn: Astronomy.Body.Saturn,
  Uranus: Astronomy.Body.Uranus,
  Neptune: Astronomy.Body.Neptune,
  Pluto: Astronomy.Body.Pluto,
};

export interface PlanetPosition {
  name: PlanetName;
  /** Tropical ecliptic longitude of date, degrees in [0, 360). */
  longitude: number;
  latitude: number;
  sign: Sign;
  degreeInSign: number;
  /** Degrees per day; negative means retrograde. */
  speed: number;
  retrograde: boolean;
  /** Whole-sign house, 1-12. Only present when a birth place is known. */
  house?: number;
}

export interface Angles {
  ascendant: number;
  midheaven: number;
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface Chart {
  date: Date;
  planets: PlanetPosition[];
  angles?: Angles;
  aspects: Aspect[];
}

/**
 * Geocentric tropical ecliptic longitude of date, which is what astrological
 * charts are drawn in — not the J2000 frame astronomy-engine returns by default.
 */
export function eclipticOfDate(
  body: Astronomy.Body,
  date: Date,
): { longitude: number; latitude: number } {
  const vector = Astronomy.GeoVector(body, date, true);
  const rotation = Astronomy.Rotation_EQJ_ECT(date);
  const sphere = Astronomy.SphereFromVector(
    Astronomy.RotateVector(rotation, vector),
  );
  return { longitude: normalizeDegrees(sphere.lon), latitude: sphere.lat };
}

const SPEED_SAMPLE_HOURS = 6;

export function planetPosition(name: PlanetName, date: Date): PlanetPosition {
  const body = BODY[name];
  const { longitude, latitude } = eclipticOfDate(body, date);

  const dtMs = (SPEED_SAMPLE_HOURS / 2) * 3600 * 1000;
  const before = eclipticOfDate(body, new Date(date.getTime() - dtMs)).longitude;
  const after = eclipticOfDate(body, new Date(date.getTime() + dtMs)).longitude;
  let delta = after - before;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  const speed = delta / (SPEED_SAMPLE_HOURS / 24);

  return {
    name,
    longitude,
    latitude,
    sign: signFromLongitude(longitude),
    degreeInSign: degreeInSign(longitude),
    speed,
    // The Sun and Moon never retrograde; tiny numerical noise shouldn't say otherwise.
    retrograde: name !== "Sun" && name !== "Moon" && speed < 0,
  };
}

/** Mean obliquity of the ecliptic (Laskar), degrees. */
function obliquity(date: Date): number {
  // `tt` is days since the J2000 epoch in Terrestrial Time.
  const t = Astronomy.MakeTime(date).tt / 36525;
  return (
    23.439291111 -
    (46.815 * t + 0.00059 * t * t - 0.001813 * t * t * t) / 3600
  );
}

/**
 * Ascendant and Midheaven for a moment and place.
 *
 * Ascendant is the ecliptic degree rising on the eastern horizon; Midheaven is
 * the ecliptic degree crossing the upper meridian.
 */
export function angles(date: Date, place: GeoPoint): Angles {
  const gast = Astronomy.SiderealTime(date); // hours
  const lstHours = gast + place.longitude / 15;
  const ramc = normalizeDegrees(lstHours * 15);

  const rad = Math.PI / 180;
  const eps = obliquity(date) * rad;
  const phi = place.latitude * rad;
  const ramcRad = ramc * rad;

  const midheaven = normalizeDegrees(
    Math.atan2(Math.sin(ramcRad), Math.cos(ramcRad) * Math.cos(eps)) / rad,
  );

  const ascendant = normalizeDegrees(
    Math.atan2(
      Math.cos(ramcRad),
      -(Math.sin(ramcRad) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps)),
    ) / rad,
  );

  return { ascendant, midheaven };
}

/** Whole-sign houses: the Ascendant's sign is the whole of the 1st house. */
export function wholeSignHouse(longitude: number, ascendant: number): number {
  const ascSignIndex = Math.floor(normalizeDegrees(ascendant) / 30);
  const signIndex = Math.floor(normalizeDegrees(longitude) / 30);
  return ((signIndex - ascSignIndex + 12) % 12) + 1;
}

export const ASPECTS = [
  { name: "conjunction", angle: 0, harmony: "blend" },
  { name: "sextile", angle: 60, harmony: "easy" },
  { name: "square", angle: 90, harmony: "tense" },
  { name: "trine", angle: 120, harmony: "easy" },
  { name: "opposition", angle: 180, harmony: "tense" },
] as const;

export type AspectName = (typeof ASPECTS)[number]["name"];
export type AspectHarmony = (typeof ASPECTS)[number]["harmony"];

export interface Aspect {
  a: string;
  b: string;
  name: AspectName;
  harmony: AspectHarmony;
  /** How far from exact, in degrees. */
  orb: number;
  applying: boolean;
}

/** Luminaries get wider orbs than the outer planets, as is conventional. */
function maxOrb(a: string, b: string, aspect: AspectName): number {
  const luminary = (n: string) => n === "Sun" || n === "Moon";
  const base = luminary(a) || luminary(b) ? 8 : 6;
  return aspect === "sextile" ? base - 2 : base;
}

interface AspectBody {
  name: string;
  longitude: number;
  speed: number;
}

function aspectBetween(
  a: AspectBody,
  b: AspectBody,
  orbScale: number,
): Aspect | null {
  const separation = angularSeparation(a.longitude, b.longitude);
  for (const aspect of ASPECTS) {
    const orb = Math.abs(separation - aspect.angle);
    if (orb > maxOrb(a.name, b.name, aspect.name) * orbScale) continue;

    // An aspect is applying when the separation is still closing on exact.
    const step = 0.05;
    const laterSeparation = angularSeparation(
      a.longitude + a.speed * step,
      b.longitude + b.speed * step,
    );
    const applying =
      Math.abs(laterSeparation - aspect.angle) < orb;

    return {
      a: a.name,
      b: b.name,
      name: aspect.name,
      harmony: aspect.harmony,
      orb,
      applying,
    };
  }
  return null;
}

export function aspectsWithin(planets: PlanetPosition[]): Aspect[] {
  const found: Aspect[] = [];
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const aspect = aspectBetween(planets[i], planets[j], 1);
      if (aspect) found.push(aspect);
    }
  }
  return found.sort((x, y) => x.orb - y.orb);
}

/**
 * Aspects from today's sky to a natal chart. Orbs are deliberately tighter than
 * natal orbs so the list stays short and actually meaningful for a given day.
 */
export function transitAspects(
  transiting: PlanetPosition[],
  natal: PlanetPosition[],
  natalAngles?: Angles,
): Aspect[] {
  const targets: AspectBody[] = natal.map((p) => ({
    name: p.name,
    longitude: p.longitude,
    speed: p.speed,
  }));
  if (natalAngles) {
    targets.push({
      name: "Ascendant",
      longitude: natalAngles.ascendant,
      speed: 0,
    });
    targets.push({
      name: "Midheaven",
      longitude: natalAngles.midheaven,
      speed: 0,
    });
  }

  const found: Aspect[] = [];
  for (const t of transiting) {
    for (const n of targets) {
      const aspect = aspectBetween(t, n, 0.45);
      if (aspect) found.push(aspect);
    }
  }
  return found.sort((x, y) => x.orb - y.orb);
}

export function natalChart(date: Date, place?: GeoPoint): Chart {
  const planets = PLANETS.map((name) => planetPosition(name, date));
  const chartAngles = place ? angles(date, place) : undefined;
  if (chartAngles) {
    for (const planet of planets) {
      planet.house = wholeSignHouse(planet.longitude, chartAngles.ascendant);
    }
  }
  return {
    date,
    planets,
    angles: chartAngles,
    aspects: aspectsWithin(planets),
  };
}

export function skyNow(date: Date = new Date()): Chart {
  const planets = PLANETS.map((name) => planetPosition(name, date));
  return { date, planets, aspects: aspectsWithin(planets) };
}

export const MOON_PHASES = [
  "New Moon",
  "Waxing Crescent",
  "First Quarter",
  "Waxing Gibbous",
  "Full Moon",
  "Waning Gibbous",
  "Last Quarter",
  "Waning Crescent",
] as const;

export type MoonPhase = (typeof MOON_PHASES)[number];

export interface MoonPhaseInfo {
  /** Elongation of the Moon from the Sun, 0-360 degrees. */
  angle: number;
  phase: MoonPhase;
  /** Illuminated fraction of the Moon's disc, 0-1. */
  illumination: number;
}

export function moonPhase(date: Date = new Date()): MoonPhaseInfo {
  const angle = Astronomy.MoonPhase(date);
  const index = Math.floor(normalizeDegrees(angle + 22.5) / 45) % 8;
  return {
    angle,
    phase: MOON_PHASES[index],
    illumination: (1 - Math.cos((angle * Math.PI) / 180)) / 2,
  };
}
