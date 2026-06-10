import { NextRequest, NextResponse } from "next/server";
import { getSimilarSongs } from "@/lib/recommendations";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const songId = searchParams.get("songId");
    const limit  = parseInt(searchParams.get("limit") ?? "10");

    if (!songId) {
      return NextResponse.json({ error: "songId requis" }, { status: 400 });
    }

    const songs = await getSimilarSongs(songId, limit);
    return NextResponse.json({ songs });
  } catch (err) {
    console.error("[SIMILAR]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}