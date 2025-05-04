import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const therapists = await prisma.therapist.findMany();
    return NextResponse.json(therapists);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("GET error:", error.message);
    }
    return NextResponse.json({ error: "Failed to fetch therapists" }, { status: 500 });
  }
}