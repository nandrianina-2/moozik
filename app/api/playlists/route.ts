import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Playlist from "@/models/Playlist";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    await connectDB();

    const playlists = await Playlist.find({ user: session.user.id })
      .populate("songs", "title artist duration coverUrl")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      playlists: playlists.map((p) => ({
        ...p,
        id: p._id.toString(),
        user: session.user.id,
        songs: (p.songs as any[]).map((s) => ({
          ...s,
          id: s._id.toString(),
        })),
      })),
    });
  } catch (err) {
    console.error("[PLAYLISTS GET]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { name, description, isPublic } = await req.json();

    if (!name?.trim()) {
      return NextResponse.json({ error: "Nom requis" }, { status: 400 });
    }

    await connectDB();

    const playlist = await Playlist.create({
      name: name.trim(),
      description: description?.trim(),
      isPublic: isPublic ?? false,
      user: session.user.id,
      songs: [],
    });

    return NextResponse.json({
      id: playlist._id.toString(),
      name: playlist.name,
      description: playlist.description,
      isPublic: playlist.isPublic,
      songs: [],
      userId: session.user.id,
      createdAt: playlist.createdAt,
    }, { status: 201 });
  } catch (err) {
    console.error("[PLAYLIST POST]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}