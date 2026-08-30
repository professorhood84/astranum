import * as Astronomy from "astronomy-engine";

export const ANIMALS = [
  "Rat",
  "Ox",
  "Tiger",
  "Rabbit",
  "Dragon",
  "Snake",
  "Horse",
  "Goat",
  "Monkey",
  "Rooster",
  "Dog",
  "Pig",
] as const;

export type Animal = (typeof ANIMALS)[number];

/** In cycle order: each element rules two consecutive years (Yang then Yin). */
export const CHINESE_ELEMENTS = [
  "Wood",
  "Fire",
  "Earth",
  "Metal",
  "Water",
] as const;

export type ChineseElement = (typeof CHINESE_ELEMENTS)[number];

export interface ChineseZodiac {
  /** The lunisolar year the birth date falls in, which is not always the Gregorian year. */
  year: number;
  animal: Animal;
  element: ChineseElement;
  polarity: "Yang" | "Yin";
  /** Start of that lunisolar year, as an ISO date in China Standard Time. */
  newYear: string;
}

const CHINA_OFFSET_HOURS = 8;

function chinaDateString(date: Date): string {
  const shifted = new Date(date.getTime() + CHINA_OFFSET_HOURS * 3600 * 1000);
  return shifted.toISOString().slice(0, 10);
}

/**
 * Chinese New Year is the second new moon after the December solstice — the day
 * (in China Standard Time) that new moon falls on.
 *
 * This is the standard rule and is correct for every year in the range this app
 * accepts birth dates for; it can differ by a month in the rare years that carry
 * a leap eleventh month.
 */
export function chineseNewYear(year: number): string {
  const solstice = Astronomy.Seasons(year - 1).dec_solstice;
  const firstNewMoon = Astronomy.SearchMoonPhase(0, solstice, 40);
  if (!firstNewMoon) throw new Error(`no new moon found after ${year - 1} solstice`);
  const secondNewMoon = Astronomy.SearchMoonPhase(
    0,
    firstNewMoon.AddDays(1),
    40,
  );
  if (!secondNewMoon) throw new Error(`no second new moon found for ${year}`);
  return chinaDateString(secondNewMoon.date);
}

function animalFor(year: number): Animal {
  return ANIMALS[(((year - 4) % 12) + 12) % 12];
}

function elementFor(year: number): ChineseElement {
  return CHINESE_ELEMENTS[Math.floor(((((year - 4) % 10) + 10) % 10) / 2)];
}

function polarityFor(year: number): "Yang" | "Yin" {
  return year % 2 === 0 ? "Yang" : "Yin";
}

export function chineseZodiacForYear(year: number): Omit<ChineseZodiac, "newYear"> {
  return {
    year,
    animal: animalFor(year),
    element: elementFor(year),
    polarity: polarityFor(year),
  };
}

/**
 * Resolve the zodiac year for a birth date, handling the late-January to
 * mid-February window where the Gregorian and lunisolar years disagree — the
 * case the previous version of Astranum asked users to fix by hand.
 */
export function chineseZodiac(birthDate: string): ChineseZodiac {
  const gregorianYear = Number(birthDate.slice(0, 4));
  const thisYearsNewYear = chineseNewYear(gregorianYear);
  const year =
    birthDate < thisYearsNewYear ? gregorianYear - 1 : gregorianYear;
  return {
    ...chineseZodiacForYear(year),
    newYear: year === gregorianYear ? thisYearsNewYear : chineseNewYear(year),
  };
}

const COMPATIBLE: Record<Animal, Animal[]> = {
  Rat: ["Dragon", "Monkey", "Ox"],
  Ox: ["Snake", "Rooster", "Rat"],
  Tiger: ["Horse", "Dog", "Pig"],
  Rabbit: ["Goat", "Pig", "Dog"],
  Dragon: ["Rat", "Monkey", "Rooster"],
  Snake: ["Ox", "Rooster", "Monkey"],
  Horse: ["Tiger", "Dog", "Goat"],
  Goat: ["Rabbit", "Pig", "Horse"],
  Monkey: ["Rat", "Dragon", "Snake"],
  Rooster: ["Ox", "Snake", "Dragon"],
  Dog: ["Tiger", "Horse", "Rabbit"],
  Pig: ["Rabbit", "Goat", "Tiger"],
};

const CLASH: Record<Animal, Animal> = {
  Rat: "Horse",
  Ox: "Goat",
  Tiger: "Monkey",
  Rabbit: "Rooster",
  Dragon: "Dog",
  Snake: "Pig",
  Horse: "Rat",
  Goat: "Ox",
  Monkey: "Tiger",
  Rooster: "Rabbit",
  Dog: "Dragon",
  Pig: "Snake",
};

export function animalAffinity(animal: Animal): {
  allies: Animal[];
  clash: Animal;
} {
  return { allies: COMPATIBLE[animal], clash: CLASH[animal] };
}

/**
 * How the current lunisolar year is traditionally read for someone born under a
 * given animal. Being in your own animal's year (ben ming nian) is the classic
 * "test year"; the clashing animal's year is the other one to name.
 */
export function yearRelationship(
  birthAnimal: Animal,
  yearAnimal: Animal,
): "own-year" | "clash" | "ally" | "neutral" {
  if (birthAnimal === yearAnimal) return "own-year";
  if (CLASH[birthAnimal] === yearAnimal) return "clash";
  if (COMPATIBLE[birthAnimal].includes(yearAnimal)) return "ally";
  return "neutral";
}
