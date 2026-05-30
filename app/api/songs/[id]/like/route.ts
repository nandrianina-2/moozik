import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Song from "@/models/Song";
import User from "@/models/User";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const song = await Song.findById(id);
    if (!song) {
      return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    }

    // Toggle like — on utilisera un modèle Like dédié au sprint 5
    // Pour l'instant on incrémente/décrémente simplement
    song.likesCount = Math.max(0, song.likesCount + 1);
    await song.save();

    return NextResponse.json({ liked: true, likesCount: song.likesCount });
  } catch (err) {
    console.error("[LIKE]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}