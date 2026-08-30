"use client";

import { useCallback, useEffect, useState } from "react";

import { BirthForm } from "@/components/BirthForm";
import { ReadingView } from "@/components/ReadingView";
import type { BirthInput, Reading } from "@/lib/reading";

const STORAGE_KEY = "astranum.birth";

export default function ReadingPage() {
  const [saved, setSaved] = useState<BirthInput | null>(null);
  const [reading, setReading] = useState<Reading | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  const generate = useCallback(async (input: BirthInput, remember = true) => {
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!response.ok) throw new Error("reading failed");
      setReading((await response.json()) as Reading);
      setEditing(false);
      if (remember) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(input));
        setSaved(input);
      }
    } catch {
      setError("Something went wrong calculating your chart. Try again.");
    } finally {
      setPending(false);
    }
  }, []);

  // A returning visitor should land straight on today's reading, which is
  // different from yesterday's because the transits and personal day have moved.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      const input = JSON.parse(stored) as BirthInput;
      setSaved(input);
      void generate(input, false);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [generate]);

  const showForm = !reading || editing;

  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      {showForm ? (
        <>
          <h1 className="font-display text-3xl text-white sm:text-4xl">
            Your personal reading
          </h1>
          <p className="mt-3 text-lilac">
            Your birth details are used to cast a real chart for the moment you
            were born, then read against today&rsquo;s sky. They stay in this
            browser — nothing is sent anywhere but the calculation.
          </p>
          <div className="mt-8 rounded-2xl border border-lilac/15 bg-card/50 p-6 sm:p-8">
            <BirthForm
              initial={saved ?? undefined}
              onSubmit={(input) => void generate(input)}
              pending={pending}
            />
          </div>
          {error && <p className="mt-4 text-sm text-gold">{error}</p>}
          {reading && (
            <button
              className="mt-6 text-sm text-lilac underline hover:text-gold"
              onClick={() => setEditing(false)}
            >
              Back to my reading
            </button>
          )}
        </>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-display text-3xl text-white sm:text-4xl">
              Your reading
            </h1>
            <div className="flex gap-4 text-sm">
              <button
                className="text-lilac underline hover:text-gold"
                onClick={() => setEditing(true)}
              >
                Edit details
              </button>
              <button
                className="text-lilac underline hover:text-gold"
                onClick={() => {
                  localStorage.removeItem(STORAGE_KEY);
                  setSaved(null);
                  setReading(null);
                }}
              >
                Start over
              </button>
            </div>
          </div>
          <ReadingView reading={reading} />
        </>
      )}
    </main>
  );
}
