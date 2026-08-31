import { describe, expect, it } from "vitest";

import {
  chineseNewYear,
  chineseZodiac,
  chineseZodiacForYear,
  yearRelationship,
} from "@/lib/chinese";

describe("chineseNewYear", () => {
  // Published Chinese New Year dates.
  const known: Record<number, string> = {
    1900: "1900-01-31",
    1949: "1949-01-29",
    1990: "1990-01-27",
    2000: "2000-02-05",
    2020: "2020-01-25",
    2023: "2023-01-22",
    2024: "2024-02-10",
    2025: "2025-01-29",
    2026: "2026-02-17",
    2033: "2033-01-31",
  };

  for (const [year, date] of Object.entries(known)) {
    it(`is ${date} in ${year}`, () => {
      expect(chineseNewYear(Number(year))).toBe(date);
    });
  }
});

describe("chineseZodiacForYear", () => {
  it("reads 2024 as the Yang Wood Dragon", () => {
    expect(chineseZodiacForYear(2024)).toEqual({
      year: 2024,
      animal: "Dragon",
      element: "Wood",
      polarity: "Yang",
    });
  });

  it("reads 1987 as the Yin Fire Rabbit", () => {
    expect(chineseZodiacForYear(1987)).toMatchObject({
      animal: "Rabbit",
      element: "Fire",
      polarity: "Yin",
    });
  });

  it("reads 1960 as the Yang Metal Rat", () => {
    expect(chineseZodiacForYear(1960)).toMatchObject({
      animal: "Rat",
      element: "Metal",
      polarity: "Yang",
    });
  });
});

describe("chineseZodiac", () => {
  it("assigns the previous animal to births before the new year", () => {
    // 2024's new year is Feb 10; Feb 3 is still the 2023 Rabbit year.
    expect(chineseZodiac("2024-02-03")).toMatchObject({
      year: 2023,
      animal: "Rabbit",
      element: "Water",
      newYear: "2023-01-22",
    });
  });

  it("assigns the current animal on the new year itself", () => {
    expect(chineseZodiac("2024-02-10")).toMatchObject({
      year: 2024,
      animal: "Dragon",
    });
  });

  it("handles a late-January birth that crosses the boundary", () => {
    expect(chineseZodiac("1990-01-15")).toMatchObject({
      year: 1989,
      animal: "Snake",
    });
    expect(chineseZodiac("1990-02-15")).toMatchObject({
      year: 1990,
      animal: "Horse",
    });
  });
});

describe("yearRelationship", () => {
  it("names your own animal's year", () => {
    expect(yearRelationship("Dragon", "Dragon")).toBe("own-year");
  });

  it("names the clash year", () => {
    expect(yearRelationship("Rat", "Horse")).toBe("clash");
  });

  it("names an ally year", () => {
    expect(yearRelationship("Rat", "Monkey")).toBe("ally");
  });
});
