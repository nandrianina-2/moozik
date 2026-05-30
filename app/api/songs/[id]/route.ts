import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Song from "@/models/Song";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const song = await Song.findById(id)
      .populate("artist", "name slug image isVerified")
      .lean();

    if (!song) {
      return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    }

    return NextResponse.json({
      ...song,
      id: (song._id as any).toString(),
      artist: {
        ...(song.artist as any),
        id: (song.artist as any)._id.toString(),
      },
    });
  } catch (err) {
    console.error("[SONG GET]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}