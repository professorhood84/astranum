"use client";

import { useEffect, useRef, useState } from "react";

import type { Place } from "@/lib/places";
import type { BirthInput } from "@/lib/reading";

const FIELD =
  "w-full rounded-lg border border-lilac/25 bg-ink-soft/80 px-4 py-3 text-paper outline-none placeholder:text-lilac/40 focus:border-gold";
const LABEL = "block text-sm text-white";
const HINT = "mt-1 text-xs text-lilac/70";

export function BirthForm({
  initial,
  onSubmit,
  pending,
}: {
  initial?: BirthInput;
  onSubmit: (input: BirthInput) => void;
  pending: boolean;
}) {
  const [fullName, setFullName] = useState(initial?.fullName ?? "");
  const [birthDate, setBirthDate] = useState(initial?.birthDate ?? "");
  const [birthTime, setBirthTime] = useState(initial?.birthTime ?? "");
  const [placeQuery, setPlaceQuery] = useState(initial?.place?.label ?? "");
  const [place, setPlace] = useState<BirthInput["place"]>(initial?.place);
  const [options, setOptions] = useState<Place[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const searchToken = useRef(0);

  useEffect(() => {
    if (place && placeQuery === place.label) return;
    if (placeQuery.trim().length < 2) {
      setOptions([]);
      return;
    }

    const token = ++searchToken.current;
    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/places?q=${encodeURIComponent(placeQuery.trim())}`,
        );
        const data = (await response.json()) as { places: Place[] };
        if (token === searchToken.current) setOptions(data.places);
      } finally {
        if (token === searchToken.current) setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [placeQuery, place]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!fullName.trim() || !birthDate) {
      setError("Your full name and birth date are needed to calculate anything.");
      return;
    }
    if (birthTime && !place) {
      setError(
        "Pick your birth city from the list — a birth time only means something once we know its time zone.",
      );
      return;
    }
    setError("");
    onSubmit({
      fullName: fullName.trim(),
      birthDate,
      birthTime: birthTime || undefined,
      place,
    });
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div>
        <label className={LABEL} htmlFor="full-name">
          Full name
        </label>
        <input
          id="full-name"
          className={`${FIELD} mt-2`}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your full birth name"
          autoComplete="name"
        />
        <p className={HINT}>
          Use your full name at birth if you know it — every letter feeds the
          Expression, Soul Urge and Personality numbers.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="birth-date">
            Birth date
          </label>
          <input
            id="birth-date"
            type="date"
            className={`${FIELD} mt-2`}
            value={birthDate}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </div>
        <div>
          <label className={LABEL} htmlFor="birth-time">
            Birth time <span className="text-lilac/60">(optional)</span>
          </label>
          <input
            id="birth-time"
            type="time"
            className={`${FIELD} mt-2`}
            value={birthTime}
            onChange={(e) => setBirthTime(e.target.value)}
          />
          <p className={HINT}>
            This is what unlocks your Rising sign and houses, and pins your Moon
            down exactly.
          </p>
        </div>
      </div>

      <div>
        <label className={LABEL} htmlFor="birth-city">
          Birth city
        </label>
        <input
          id="birth-city"
          className={`${FIELD} mt-2`}
          value={placeQuery}
          onChange={(e) => {
            setPlaceQuery(e.target.value);
            setPlace(undefined);
          }}
          placeholder="Start typing, then pick from the list"
          autoComplete="off"
        />
        {place ? (
          <p className={HINT}>
            {place.label} · {place.timeZone} · {place.latitude.toFixed(2)},{" "}
            {place.longitude.toFixed(2)}
          </p>
        ) : (
          <p className={HINT}>
            {searching ? "Searching…" : "We use it for the time zone and horizon."}
          </p>
        )}
        {options.length > 0 && !place && (
          <ul className="mt-2 divide-y divide-lilac/10 overflow-hidden rounded-lg border border-lilac/20 bg-ink-soft">
            {options.map((option) => (
              <li key={`${option.label}-${option.latitude}`}>
                <button
                  type="button"
                  className="w-full px-4 py-2.5 text-left text-sm text-paper hover:bg-card"
                  onClick={() => {
                    setPlace({
                      label: option.label,
                      latitude: option.latitude,
                      longitude: option.longitude,
                      timeZone: option.timeZone,
                    });
                    setPlaceQuery(option.label);
                    setOptions([]);
                  }}
                >
                  {option.label}
                  <span className="ml-2 text-xs text-lilac/60">
                    {option.timeZone}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className="text-sm text-gold">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-gold px-7 py-3 font-medium text-ink transition hover:bg-gold/90 disabled:opacity-60"
      >
        {pending ? "Calculating…" : "Reveal my reading"}
      </button>
    </form>
  );
}
