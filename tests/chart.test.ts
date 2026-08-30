import * as Astronomy from "astronomy-engine";
import { describe, expect, it } from "vitest";

import {
  angles,
  eclipticOfDate,
  moonPhase,
  natalChart,
  planetPosition,
  wholeSignHouse,
} from "@/lib/chart";
import { signFromLongitude } from "@/lib/zodiac";

/**
 * Convert an ecliptic-of-date longitude to horizontal coordinates, so we can
 * assert that the Ascendant really is on the horizon and the Midheaven really
 * is on the meridian rather than trusting the formulas.
 */
function horizonFor(longitude: number, date: Date, lat: number, lon: number) {
  const time = Astronomy.MakeTime(date);
  // Horizon() wants equator-of-date coordinates, and refraction would lift the
  // Ascendant off the true horizon, so it is left out.
  const vector = Astronomy.RotateVector(
    Astronomy.Rotation_ECT_EQD(date),
    Astronomy.VectorFromSphere(new Astronomy.Spherical(0, longitude, 1), time),
  );
  const equatorial = Astronomy.EquatorFromVector(vector);
  return Astronomy.Horizon(
    date,
    new Astronomy.Observer(lat, lon, 0),
    equatorial.ra,
    equatorial.dec,
    undefined,
  );
}

const PLACES = [
  { name: "New York", date: new Date("1990-06-15T14:30:00Z"), lat: 40.7128, lon: -74.006 },
  { name: "Sydney", date: new Date("2026-08-30T03:10:00Z"), lat: -33.8688, lon: 151.2093 },
  { name: "London", date: new Date("1975-01-02T22:45:00Z"), lat: 51.5072, lon: -0.1276 },
  { name: "Nairobi", date: new Date("2001-11-09T06:02:00Z"), lat: -1.2921, lon: 36.8219 },
];

describe("angles", () => {
  for (const place of PLACES) {
    it(`puts the Ascendant on the eastern horizon in ${place.name}`, () => {
      const { ascendant } = angles(place.date, {
        latitude: place.lat,
        longitude: place.lon,
      });
      const horizon = horizonFor(ascendant, place.date, place.lat, place.lon);
      expect(Math.abs(horizon.altitude)).toBeLessThan(0.05);
      // Azimuth is measured clockwise from north, so the east half is 0-180.
      expect(horizon.azimuth).toBeGreaterThan(0);
      expect(horizon.azimuth).toBeLessThan(180);
    });

    it(`puts the Midheaven on the upper meridian in ${place.name}`, () => {
      const { midheaven } = angles(place.date, {
        latitude: place.lat,
        longitude: place.lon,
      });
      const horizon = horizonFor(midheaven, place.date, place.lat, place.lon);
      const offMeridian = Math.min(
        Math.abs(horizon.azimuth - 180),
        Math.abs(horizon.azimuth - 0),
        Math.abs(horizon.azimuth - 360),
      );
      expect(offMeridian).toBeLessThan(0.05);
      expect(horizon.altitude).toBeGreaterThan(0);
    });
  }
});

describe("planetPosition", () => {
  it("agrees with the Sun's known sign ingress dates", () => {
    // The Sun enters Virgo around Aug 22-23 each year.
    expect(signFromLongitude(planetPosition("Sun", new Date("2026-08-20T12:00:00Z")).longitude)).toBe("Leo");
    expect(signFromLongitude(planetPosition("Sun", new Date("2026-08-25T12:00:00Z")).longitude)).toBe("Virgo");
  });

  it("puts the Sun at 0 degrees Aries at the March equinox", () => {
    const equinox = Astronomy.Seasons(2026).mar_equinox.date;
    const sun = planetPosition("Sun", equinox);
    expect(Math.min(sun.longitude, 360 - sun.longitude)).toBeLessThan(0.02);
  });

  it("moves the Sun about a degree a day", () => {
    const sun = planetPosition("Sun", new Date("2026-08-30T00:00:00Z"));
    expect(sun.speed).toBeGreaterThan(0.9);
    expect(sun.speed).toBeLessThan(1.05);
    expect(sun.retrograde).toBe(false);
  });

  it("moves the Moon about thirteen degrees a day", () => {
    const moon = planetPosition("Moon", new Date("2026-08-30T00:00:00Z"));
    expect(moon.speed).toBeGreaterThan(11);
    expect(moon.speed).toBeLessThan(16);
    expect(moon.retrograde).toBe(false);
  });

  it("detects a known Mercury retrograde period", () => {
    // Mercury was retrograde from Aug 5 to Aug 28, 2024.
    expect(planetPosition("Mercury", new Date("2024-08-15T00:00:00Z")).retrograde).toBe(true);
    expect(planetPosition("Mercury", new Date("2024-09-15T00:00:00Z")).retrograde).toBe(false);
  });

  it("keeps the outer planets in their slow lane", () => {
    const pluto = planetPosition("Pluto", new Date("2026-08-30T00:00:00Z"));
    expect(Math.abs(pluto.speed)).toBeLessThan(0.1);
  });
});

describe("eclipticOfDate", () => {
  it("differs from the J2000 frame by roughly the accumulated precession", () => {
    const date = new Date("2026-08-30T00:00:00Z");
    const ofDate = eclipticOfDate(Astronomy.Body.Sun, date).longitude;
    const j2000 = Astronomy.SphereFromVector(
      Astronomy.RotateVector(
        Astronomy.Rotation_EQJ_ECL(),
        Astronomy.GeoVector(Astronomy.Body.Sun, date, true),
      ),
    ).lon;
    // ~50.3 arcsec/year of precession over ~26.7 years.
    const difference = ofDate - j2000;
    expect(difference).toBeGreaterThan(0.3);
    expect(difference).toBeLessThan(0.45);
  });
});

describe("wholeSignHouse", () => {
  it("puts the Ascendant's own sign in the first house", () => {
    expect(wholeSignHouse(15, 25)).toBe(1); // both in Aries
  });

  it("counts forward through the signs", () => {
    expect(wholeSignHouse(35, 25)).toBe(2); // Taurus, Aries rising
    expect(wholeSignHouse(355, 25)).toBe(12); // Pisces, Aries rising
  });
});

describe("natalChart", () => {
  it("returns every planet with a house when a place is known", () => {
    const chart = natalChart(new Date("1990-06-15T14:30:00Z"), {
      latitude: 40.7128,
      longitude: -74.006,
    });
    expect(chart.planets).toHaveLength(10);
    expect(chart.planets.every((p) => p.house !== undefined)).toBe(true);
    expect(chart.angles).toBeDefined();
  });

  it("omits houses when no place is known", () => {
    const chart = natalChart(new Date("1990-06-15T14:30:00Z"));
    expect(chart.angles).toBeUndefined();
    expect(chart.planets.every((p) => p.house === undefined)).toBe(true);
  });

  it("finds the Sun-Moon aspect at a full moon", () => {
    const fullMoon = Astronomy.SearchMoonPhase(180, new Date("2026-08-01T00:00:00Z"), 40);
    const chart = natalChart(fullMoon!.date);
    const sunMoon = chart.aspects.find(
      (a) => a.a === "Sun" && a.b === "Moon",
    );
    expect(sunMoon?.name).toBe("opposition");
    expect(sunMoon?.orb).toBeLessThan(0.1);
  });
});

describe("moonPhase", () => {
  it("reads a new moon as new and dark", () => {
    const newMoon = Astronomy.SearchMoonPhase(0, new Date("2026-08-01T00:00:00Z"), 40);
    const phase = moonPhase(newMoon!.date);
    expect(phase.phase).toBe("New Moon");
    expect(phase.illumination).toBeLessThan(0.01);
  });

  it("reads a full moon as full and lit", () => {
    const fullMoon = Astronomy.SearchMoonPhase(180, new Date("2026-08-01T00:00:00Z"), 40);
    const phase = moonPhase(fullMoon!.date);
    expect(phase.phase).toBe("Full Moon");
    expect(phase.illumination).toBeGreaterThan(0.99);
  });
});
