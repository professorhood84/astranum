import {
  type Aspect,
  type Chart,
  type PlanetName,
  type PlanetPosition,
  moonPhase,
  natalChart,
  planetPosition,
  skyNow,
  transitAspects,
  wholeSignHouse,
} from "./chart";
import {
  type Animal,
  type ChineseElement,
  animalAffinity,
  chineseZodiac,
  chineseZodiacForYear,
  yearRelationship,
} from "./chinese";
import { ANIMAL_CONTENT, ELEMENT_CONTENT, YEAR_RELATIONSHIP_CONTENT } from "./content/animals";
import { BIRTHDAY_CONTENT, NUMBER_CONTENT } from "./content/numbers";
import { HOUSE_MEANING, PLANET_CONTENT } from "./content/planets";
import { SIGN_CONTENT } from "./content/signs";
import { numerologyProfile, type NumerologyProfile } from "./numerology";
import { zonedTimeToUtc } from "./time";
import {
  SIGN_ELEMENT,
  SIGN_MODALITY,
  SIGN_RULER,
  formatLongitude,
  signFromLongitude,
  type Sign,
} from "./zodiac";

export interface BirthInput {
  fullName: string;
  /** YYYY-MM-DD */
  birthDate: string;
  /** HH:MM, local to the birth place. Optional. */
  birthTime?: string;
  place?: {
    label: string;
    latitude: number;
    longitude: number;
    timeZone: string;
  };
}

export interface Placement {
  planet: PlanetName;
  sign: Sign;
  longitude: number;
  formatted: string;
  retrograde: boolean;
  house?: number;
  houseMeaning?: string;
}

export interface TransitLine {
  aspect: Aspect;
  headline: string;
  body: string;
}

export interface Reading {
  name: string;
  firstName: string;
  /** The instant the chart was cast for, in UTC. */
  birthInstant: string;
  generatedFor: string;
  /** True when no birth time was given, so we defaulted to noon. */
  timeAssumed: boolean;
  /** Set when the Moon changed sign on the birth day and no time was given. */
  moonUncertain?: { first: Sign; second: Sign };
  placements: Placement[];
  sun: Sign;
  moon: Sign;
  rising?: Sign;
  midheaven?: Sign;
  sunText: string;
  moonText: string;
  risingText?: string;
  chartShape: string;
  numerology: NumerologyProfile;
  numerologyText: {
    lifePath: string;
    expression: string;
    soulUrge: string;
    personality: string;
    birthday: string;
    personalYear: string;
    today: string;
  };
  chinese: {
    animal: Animal;
    element: ChineseElement;
    polarity: "Yang" | "Yin";
    year: number;
    newYear: string;
    profile: string;
    elementText: string;
    allies: Animal[];
    clash: Animal;
    yearAnimal: Animal;
    yearElement: ChineseElement;
    yearText: string;
  };
  sky: {
    date: string;
    moonPhase: string;
    illumination: number;
    positions: Placement[];
    retrogrades: string[];
  };
  transits: TransitLine[];
  summary: string;
}

function toPlacement(position: PlanetPosition): Placement {
  return {
    planet: position.name,
    sign: position.sign,
    longitude: position.longitude,
    formatted: formatLongitude(position.longitude),
    retrograde: position.retrograde,
    house: position.house,
    houseMeaning: position.house ? HOUSE_MEANING[position.house] : undefined,
  };
}

function birthInstantFor(input: BirthInput): Date {
  if (input.place) {
    return zonedTimeToUtc(input.birthDate, input.birthTime, input.place.timeZone);
  }
  // With no place we can't resolve a zone; noon UTC keeps every fast-moving
  // placement within half a day of the truth.
  return new Date(`${input.birthDate}T${input.birthTime || "12:00"}:00Z`);
}

/** Did the Moon change sign on the birth day? Without a birth time, it matters. */
function moonAmbiguity(
  birthDate: string,
  timeZone: string | undefined,
): { first: Sign; second: Sign } | undefined {
  const start = timeZone
    ? zonedTimeToUtc(birthDate, "00:01", timeZone)
    : new Date(`${birthDate}T00:01:00Z`);
  const end = timeZone
    ? zonedTimeToUtc(birthDate, "23:59", timeZone)
    : new Date(`${birthDate}T23:59:00Z`);
  const first = planetPosition("Moon", start).sign;
  const second = planetPosition("Moon", end).sign;
  return first === second ? undefined : { first, second };
}

/**
 * A one-line read on the chart's overall balance — which element and modality
 * the planets actually cluster in, rather than judging the whole chart by the Sun.
 */
function chartShape(chart: Chart): string {
  const elements: Record<string, number> = {};
  const modalities: Record<string, number> = {};
  for (const planet of chart.planets) {
    elements[SIGN_ELEMENT[planet.sign]] = (elements[SIGN_ELEMENT[planet.sign]] ?? 0) + 1;
    modalities[SIGN_MODALITY[planet.sign]] = (modalities[SIGN_MODALITY[planet.sign]] ?? 0) + 1;
  }
  const rank = (counts: Record<string, number>) =>
    Object.entries(counts).sort((a, b) => b[1] - a[1]);

  const [topElement, elementCount] = rank(elements)[0];
  const [topModality, modalityCount] = rank(modalities)[0];
  const missing = ["Fire", "Earth", "Air", "Water"].filter((e) => !elements[e]);

  const elementLine =
    elementCount >= 4
      ? `${elementCount} of your ten planets sit in ${topElement} signs, which is a heavy weighting`
      : `your planets spread fairly evenly across the elements, with ${topElement} slightly ahead`;
  const modalityLine = `${topModality} signs carry ${modalityCount} of them`;
  const missingLine = missing.length
    ? ` You have nothing in ${missing.join(" or ")} — the quality you tend to have to learn deliberately rather than by instinct.`
    : "";

  return `${elementLine}, and ${modalityLine}.${missingLine}`;
}

const HARMONY_PHRASE: Record<Aspect["harmony"], string> = {
  blend: "fuses with",
  easy: "flows with",
  tense: "pulls against",
};

function transitLine(aspect: Aspect): TransitLine {
  const transiting = aspect.a as PlanetName;
  const target = aspect.b;
  const planet = PLANET_CONTENT[transiting];
  const targetGoverns =
    target === "Ascendant"
      ? "how you show up and start things"
      : target === "Midheaven"
        ? "your public role and direction"
        : PLANET_CONTENT[target as PlanetName].governs;

  const exactness =
    aspect.orb < 0.5
      ? "exact today"
      : aspect.applying
        ? `${aspect.orb.toFixed(1)}° away and tightening`
        : `${aspect.orb.toFixed(1)}° past exact and separating`;

  const tone =
    aspect.harmony === "tense"
      ? "Expect friction here — it's the useful kind if you engage with it rather than around it."
      : aspect.harmony === "easy"
        ? "This one opens a door rather than forcing one; it helps if you use it."
        : "These two themes merge for the moment, which intensifies both.";

  return {
    aspect,
    headline: `Transiting ${transiting} ${aspect.name} your natal ${target}`,
    body: `${planet.glyph} ${transiting} — ${planet.governs} — ${HARMONY_PHRASE[aspect.harmony]} ${target === "Ascendant" || target === "Midheaven" ? "your " + target : "your natal " + target} (${targetGoverns}). It is ${exactness}. ${tone}`,
  };
}

function summarize(
  firstName: string,
  sun: Sign,
  moon: Sign,
  rising: Sign | undefined,
  numbers: NumerologyProfile,
  animal: Animal,
  topTransit: TransitLine | undefined,
): string {
  const core = rising
    ? `${firstName}, you lead with ${rising} and run on a ${sun} Sun with a ${moon} Moon underneath.`
    : `${firstName}, you run on a ${sun} Sun with a ${moon} Moon underneath.`;
  const number = `Your Life Path ${numbers.lifePath} — ${NUMBER_CONTENT[numbers.lifePath].title} — sets the long arc, and you're in a Personal Year ${numbers.personalYear}: ${NUMBER_CONTENT[numbers.personalYear].cycle.toLowerCase()}`;
  const day = `Today is a Personal Day ${numbers.personalDay}, ${NUMBER_CONTENT[numbers.personalDay].cycle.toLowerCase()}`;
  const sky = topTransit
    ? ` The loudest thing in your sky today is ${topTransit.aspect.a} ${topTransit.aspect.name} your ${topTransit.aspect.b}.`
    : " Nothing in today's sky is making a close aspect to your chart, which makes this a quieter day than most — good for your own agenda rather than reacting to events.";

  return `${core} ${number} ${day}${sky}`;
}

export function buildReading(
  input: BirthInput,
  now: Date = new Date(),
): Reading {
  const birthInstant = birthInstantFor(input);
  const place = input.place
    ? { latitude: input.place.latitude, longitude: input.place.longitude }
    : undefined;

  const natal = natalChart(birthInstant, place);
  const sky = skyNow(now);
  const numbers = numerologyProfile(input.fullName, input.birthDate, now);
  const zodiac = chineseZodiac(input.birthDate);
  const currentZodiacYear = chineseZodiac(now.toISOString().slice(0, 10));

  const sun = natal.planets.find((p) => p.name === "Sun")!;
  const moon = natal.planets.find((p) => p.name === "Moon")!;
  const rising = natal.angles ? signFromLongitude(natal.angles.ascendant) : undefined;
  const midheaven = natal.angles
    ? signFromLongitude(natal.angles.midheaven)
    : undefined;

  const transits = transitAspects(sky.planets, natal.planets, natal.angles)
    .slice(0, 6)
    .map(transitLine);

  const phase = moonPhase(now);
  const firstName = input.fullName.trim().split(/\s+/)[0];
  const relationship = yearRelationship(zodiac.animal, currentZodiacYear.animal);

  const sunHouse = sun.house
    ? ` It plays out in your ${ordinal(sun.house)} house, so the arena for it is ${HOUSE_MEANING[sun.house]}.`
    : "";
  const moonHouse = moon.house
    ? ` Your Moon sits in the ${ordinal(moon.house)} house — ${HOUSE_MEANING[moon.house]} is where you go to settle.`
    : "";

  return {
    name: input.fullName,
    firstName,
    birthInstant: birthInstant.toISOString(),
    generatedFor: now.toISOString(),
    timeAssumed: !input.birthTime,
    moonUncertain: input.birthTime
      ? undefined
      : moonAmbiguity(input.birthDate, input.place?.timeZone),
    placements: natal.planets.map(toPlacement),
    sun: sun.sign,
    moon: moon.sign,
    rising,
    midheaven,
    sunText: `${SIGN_CONTENT[sun.sign].sun}${sunHouse}`,
    moonText: `${SIGN_CONTENT[moon.sign].moon}${moonHouse}`,
    risingText: rising
      ? `${SIGN_CONTENT[rising].rising} ${SIGN_RULER[rising]} rules your chart, so wherever it sits is where the story of your life keeps returning.`
      : undefined,
    chartShape: chartShape(natal),
    numerology: numbers,
    numerologyText: {
      lifePath: `${NUMBER_CONTENT[numbers.lifePath].title}. ${NUMBER_CONTENT[numbers.lifePath].core}`,
      expression: `Your name adds to ${numbers.expression} — ${NUMBER_CONTENT[numbers.expression].title.toLowerCase()}. This is the toolkit you were handed: ${NUMBER_CONTENT[numbers.expression].core.toLowerCase()}`,
      soulUrge: `Your vowels give a Soul Urge of ${numbers.soulUrge}: what you privately want is ${NUMBER_CONTENT[numbers.soulUrge].desire}.`,
      personality: `Your consonants give a Personality of ${numbers.personality}: people meet you as ${NUMBER_CONTENT[numbers.personality].impression}.`,
      birthday: `Born on the ${ordinal(numbers.birthday)}, you're ${BIRTHDAY_CONTENT[numbers.birthday]}.`,
      personalYear: `Personal Year ${numbers.personalYear}. ${NUMBER_CONTENT[numbers.personalYear].cycle}`,
      today: `Personal Month ${numbers.personalMonth}, Personal Day ${numbers.personalDay}. ${NUMBER_CONTENT[numbers.personalDay].cycle}`,
    },
    chinese: {
      animal: zodiac.animal,
      element: zodiac.element,
      polarity: zodiac.polarity,
      year: zodiac.year,
      newYear: zodiac.newYear,
      profile: ANIMAL_CONTENT[zodiac.animal].profile,
      elementText: ELEMENT_CONTENT[zodiac.element],
      allies: animalAffinity(zodiac.animal).allies,
      clash: animalAffinity(zodiac.animal).clash,
      yearAnimal: currentZodiacYear.animal,
      yearElement: currentZodiacYear.element,
      yearText: YEAR_RELATIONSHIP_CONTENT[relationship],
    },
    sky: {
      date: now.toISOString(),
      moonPhase: phase.phase,
      illumination: phase.illumination,
      positions: sky.planets.map((planet) => ({
        ...toPlacement(planet),
        house: natal.angles
          ? wholeSignHouse(planet.longitude, natal.angles.ascendant)
          : undefined,
        houseMeaning: natal.angles
          ? HOUSE_MEANING[wholeSignHouse(planet.longitude, natal.angles.ascendant)]
          : undefined,
      })),
      retrogrades: sky.planets.filter((p) => p.retrograde).map((p) => p.name),
    },
    transits,
    summary: summarize(
      firstName,
      sun.sign,
      moon.sign,
      rising,
      numbers,
      zodiac.animal,
      transits[0],
    ),
  };
}

export function ordinal(n: number): string {
  const suffix =
    n % 100 >= 11 && n % 100 <= 13
      ? "th"
      : ["th", "st", "nd", "rd"][n % 10] ?? "th";
  return `${n}${suffix}`;
}

export { chineseZodiacForYear };
