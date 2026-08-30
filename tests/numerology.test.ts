import { describe, expect, it } from "vitest";

import {
  expression,
  lifePath,
  personalDay,
  personalMonth,
  personalYear,
  personality,
  reduce,
  soulUrge,
} from "@/lib/numerology";

describe("reduce", () => {
  it("reduces to a single digit", () => {
    expect(reduce(38)).toBe(11); // 3+8 = 11, a master number
    expect(reduce(39)).toBe(3); // 3+9 = 12 -> 3
    expect(reduce(7)).toBe(7);
  });

  it("stops on master numbers", () => {
    expect(reduce(11)).toBe(11);
    expect(reduce(22)).toBe(22);
    expect(reduce(33)).toBe(33);
    expect(reduce(44)).toBe(8);
  });
});

describe("lifePath", () => {
  it("reduces month, day and year separately", () => {
    // 1990-06-15: 6 + 6 (1+5) + 1 (1+9+9+0=19 -> 10 -> 1) = 13 -> 4
    expect(lifePath("1990-06-15")).toBe(4);
  });

  it("preserves a master Life Path", () => {
    // 1970-01-02: 1 + 2 + 8 (1+9+7+0=17 -> 8) = 11
    expect(lifePath("1970-01-02")).toBe(11);
    // 1970-03-11: 3 + 11 + 8 = 22
    expect(lifePath("1970-03-11")).toBe(22);
    // 1970-03-22: 3 + 22 + 8 = 33
    expect(lifePath("1970-03-22")).toBe(33);
  });

  it("computes a well-known example", () => {
    // 2000-01-01: 1 + 1 + 2 = 4
    expect(lifePath("2000-01-01")).toBe(4);
  });
});

describe("name numbers", () => {
  const name = "John Smith";
  // j1 o6 h8 n5 = 20; s1 m4 i9 t2 h8 = 24; total 44 -> 8
  it("computes Expression from every letter", () => {
    expect(expression(name)).toBe(8);
  });

  // vowels: o(6) i(9) = 15 -> 6
  it("computes Soul Urge from vowels", () => {
    expect(soulUrge(name)).toBe(6);
  });

  // consonants: j1 h8 n5 s1 m4 t2 h8 = 29 -> 11
  it("computes Personality from consonants", () => {
    expect(personality(name)).toBe(11);
  });

  it("ignores punctuation, case and spacing", () => {
    expect(expression("john  smith")).toBe(expression("John-Smith"));
  });
});

describe("personal cycles", () => {
  const birth = "1990-06-15";

  it("computes the personal year", () => {
    // 6 + 6 + 2026(=10->1) ... 6+1+5+... month 6, day 1+5=6, year 2+0+2+6=10
    expect(personalYear(birth, new Date("2026-03-04T00:00:00Z"))).toBe(4);
  });

  it("rolls the personal year over on January 1", () => {
    const before = personalYear(birth, new Date("2026-12-31T12:00:00Z"));
    const after = personalYear(birth, new Date("2027-01-01T12:00:00Z"));
    expect(after).not.toBe(before);
  });

  it("derives month and day from the year", () => {
    const date = new Date("2026-03-04T00:00:00Z");
    expect(personalMonth(birth, date)).toBe(7); // 4 + 3
    expect(personalDay(birth, date)).toBe(2); // 7 + 4 = 11 -> 2
  });
});
