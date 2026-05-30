import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Playlist from "@/models/Playlist";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const { songId } = await req.json();

    await connectDB();

    const playlist = await Playlist.findOneAndUpdate(
      { _id: id, user: session.user.id },
      { $addToSet: { songs: songId } },
      { new: true }
    );

    if (!playlist) {
      return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[PLAYLIST ADD SONG]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const { songId } = await req.json();

    await connectDB();

    await Playlist.findOneAndUpdate(
      { _id: id, user: session.user.id },
      { $pull: { songs: songId } }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[PLAYLIST REMOVE SONG]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}