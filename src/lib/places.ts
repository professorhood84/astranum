export interface Place {
  name: string;
  /** "Wichita, Kansas, United States" */
  label: string;
  latitude: number;
  longitude: number;
  timeZone: string;
  country: string;
}

interface OpenMeteoResult {
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
  country?: string;
  admin1?: string;
  population?: number;
}

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

/**
 * Open-Meteo's geocoding API — the GeoNames database, no API key, and it returns
 * the IANA time zone, which is what makes an accurate birth-time chart possible.
 */
export async function searchPlaces(query: string): Promise<Place[]> {
  const url = new URL(GEOCODING_URL);
  url.searchParams.set("name", query);
  url.searchParams.set("count", "8");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  const response = await fetch(url, { next: { revalidate: 86400 } });
  if (!response.ok) {
    throw new Error(`geocoding failed with ${response.status}`);
  }

  const data = (await response.json()) as { results?: OpenMeteoResult[] };
  return (data.results ?? []).map((result) => ({
    name: result.name,
    label: [result.name, result.admin1, result.country]
      .filter(Boolean)
      .join(", "),
    latitude: result.latitude,
    longitude: result.longitude,
    timeZone: result.timezone,
    country: result.country ?? "",
  }));
}
