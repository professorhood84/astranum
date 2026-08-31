import { NextResponse } from "next/server";

import { buildReading, type BirthInput } from "@/lib/reading";

function isValid(input: Partial<BirthInput>): input is BirthInput {
  return (
    typeof input.fullName === "string" &&
    input.fullName.trim().length > 0 &&
    typeof input.birthDate === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(input.birthDate)
  );
}

export async function POST(request: Request) {
  const input = (await request.json()) as Partial<BirthInput>;

  if (!isValid(input)) {
    return NextResponse.json(
      { error: "A full name and a birth date are required." },
      { status: 400 },
    );
  }

  return NextResponse.json(buildReading(input));
}
