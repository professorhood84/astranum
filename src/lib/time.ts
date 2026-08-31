/**
 * Local-time to UTC conversion using the IANA time zone database that ships
 * with the JS runtime, so historical DST rules (and things like the UK's
 * 1968-71 year-round summer time) are applied to old birth dates correctly.
 */

function offsetMinutes(instant: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(instant);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)!.value);

  const asUtc = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour") % 24,
    get("minute"),
    get("second"),
  );
  return (asUtc - instant.getTime()) / 60000;
}

/**
 * Interpret a wall-clock date and time in a time zone and return the UTC instant.
 *
 * `birthDate` is `YYYY-MM-DD`, `birthTime` is `HH:MM` (defaults to noon, which
 * keeps the date right for every zone when the time is unknown).
 */
export function zonedTimeToUtc(
  birthDate: string,
  birthTime: string | undefined,
  timeZone: string,
): Date {
  const [year, month, day] = birthDate.split("-").map(Number);
  const [hour, minute] = (birthTime || "12:00").split(":").map(Number);
  const naive = Date.UTC(year, month - 1, day, hour, minute);

  // The offset depends on the instant, and the instant depends on the offset;
  // two passes converge for every zone except within the ambiguous hour of a
  // DST fall-back, where it settles on one of the two valid instants.
  let instant = new Date(naive - offsetMinutes(new Date(naive), timeZone) * 60000);
  instant = new Date(naive - offsetMinutes(instant, timeZone) * 60000);
  return instant;
}

export function formatInZone(
  instant: Date,
  timeZone: string,
  options: Intl.DateTimeFormatOptions = {},
): string {
  return new Intl.DateTimeFormat("en-US", { timeZone, ...options }).format(
    instant,
  );
}

/** `YYYY-MM-DD` for an instant, as seen in a given zone. */
export function isoDateInZone(instant: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(instant);
  return parts;
}
