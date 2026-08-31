import { NextResponse } from "next/server";

import { searchPlaces } from "@/lib/places";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim();
  if (!query || query.length < 2) {
    return NextResponse.json({ places: [] });
  }

  try {
    return NextResponse.json({ places: await searchPlaces(query) });
  } catch {
    return NextResponse.json(
      { places: [], error: "Place lookup is unavailable right now." },
      { status: 502 },
    );
  }
}
