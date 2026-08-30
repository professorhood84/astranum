/**
 * Pythagorean numerology. Master numbers (11, 22, 33) are preserved wherever
 * convention preserves them, and reduced where it doesn't (Personal Year/Month/Day).
 */

const LETTER_VALUES: Record<string, number> = {
  a: 1, j: 1, s: 1,
  b: 2, k: 2, t: 2,
  c: 3, l: 3, u: 3,
  d: 4, m: 4, v: 4,
  e: 5, n: 5, w: 5,
  f: 6, o: 6, x: 6,
  g: 7, p: 7, y: 7,
  h: 8, q: 8, z: 8,
  i: 9, r: 9,
};

const VOWELS = new Set(["a", "e", "i", "o", "u"]);

export const MASTER_NUMBERS = [11, 22, 33];

function sumDigits(n: number): number {
  return String(n)
    .split("")
    .reduce((total, ch) => total + Number(ch), 0);
}

/** Reduce to a single digit, stopping on a master number. */
export function reduce(n: number): number {
  let value = n;
  while (value > 9 && !MASTER_NUMBERS.includes(value)) {
    value = sumDigits(value);
  }
  return value;
}

/** Reduce all the way to 1-9, ignoring master numbers. */
export function reduceFully(n: number): number {
  let value = n;
  while (value > 9) value = sumDigits(value);
  return value;
}

function letters(name: string): string[] {
  return name.toLowerCase().replace(/[^a-z]/g, "").split("");
}

/**
 * Life Path: reduce month, day and year separately before summing. This differs
 * from digit-summing the whole date — the two disagree for dates where a
 * component reduces to a master number, and the component method is the one
 * standard numerology uses.
 */
export function lifePath(birthDate: string): number {
  const [year, month, day] = birthDate.split("-").map(Number);
  const parts = [reduce(month), reduce(day), reduce(sumDigits(year))];
  return reduce(parts.reduce((a, b) => a + b, 0));
}

/** Expression (Destiny): every letter of the full birth name. */
export function expression(fullName: string): number {
  return reduce(
    letters(fullName).reduce((total, ch) => total + (LETTER_VALUES[ch] ?? 0), 0),
  );
}

/** Soul Urge (Heart's Desire): the vowels. */
export function soulUrge(fullName: string): number {
  return reduce(
    letters(fullName)
      .filter((ch) => VOWELS.has(ch))
      .reduce((total, ch) => total + (LETTER_VALUES[ch] ?? 0), 0),
  );
}

/** Personality: the consonants. */
export function personality(fullName: string): number {
  return reduce(
    letters(fullName)
      .filter((ch) => !VOWELS.has(ch))
      .reduce((total, ch) => total + (LETTER_VALUES[ch] ?? 0), 0),
  );
}

/** Birthday number: the day of the month, unreduced (1-31 carries its own meaning). */
export function birthday(birthDate: string): number {
  return Number(birthDate.split("-")[2]);
}

export function personalYear(birthDate: string, onDate: Date): number {
  const [, month, day] = birthDate.split("-").map(Number);
  return reduceFully(
    sumDigits(month) + sumDigits(day) + sumDigits(onDate.getFullYear()),
  );
}

export function personalMonth(birthDate: string, onDate: Date): number {
  return reduceFully(personalYear(birthDate, onDate) + (onDate.getMonth() + 1));
}

export function personalDay(birthDate: string, onDate: Date): number {
  return reduceFully(personalMonth(birthDate, onDate) + onDate.getDate());
}

export interface NumerologyProfile {
  lifePath: number;
  expression: number;
  soulUrge: number;
  personality: number;
  birthday: number;
  personalYear: number;
  personalMonth: number;
  personalDay: number;
}

export function numerologyProfile(
  fullName: string,
  birthDate: string,
  onDate: Date = new Date(),
): NumerologyProfile {
  return {
    lifePath: lifePath(birthDate),
    expression: expression(fullName),
    soulUrge: soulUrge(fullName),
    personality: personality(fullName),
    birthday: birthday(birthDate),
    personalYear: personalYear(birthDate, onDate),
    personalMonth: personalMonth(birthDate, onDate),
    personalDay: personalDay(birthDate, onDate),
  };
}
