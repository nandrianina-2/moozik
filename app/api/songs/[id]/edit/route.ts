import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Song from "@/models/Song";
import Artist from "@/models/Artist";

export async function GET(
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

    const artist = await Artist.findOne({ userId: session.user.id });
    if (!artist) {
      return NextResponse.json({ error: "Artiste introuvable" }, { status: 404 });
    }

    const song = await Song.findOne({
      _id: id,
      artist: artist._id,
    }).lean();

    if (!song) {
      return NextResponse.json({ error: "Son introuvable" }, { status: 404 });
    }

    return NextResponse.json({
      id: (song._id as any).toString(),
      title: song.title,
      coverUrl: song.coverUrl,
      genres: song.genres,
      lyrics: song.lyrics,
      isPublished: song.isPublished,
      releaseDate: song.releaseDate,
      scheduledAt: song.scheduledAt,
    });
  } catch (err) {
    console.error("[SONG EDIT GET]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    await connectDB();

    const artist = await Artist.findOne({ userId: session.user.id });
    if (!artist) {
      return NextResponse.json({ error: "Artiste introuvable" }, { status: 404 });
    }

    const allowed = ["title", "coverUrl", "genres", "lyrics",
                     "isPublished", "releaseDate", "scheduledAt"];
    const update: Record<string, any> = {};
    for (const key of allowed) {
      if (body[key] !== undefined) update[key] = body[key];
    }

    if (update.releaseDate) update.releaseDate = new Date(update.releaseDate);
    if (update.scheduledAt) update.scheduledAt = new Date(update.scheduledAt);

    const song = await Song.findOneAndUpdate(
      { _id: id, artist: artist._id },
      { $set: update },
      { new: true }
    );

    if (!song) {
      return NextResponse.json({ error: "Son introuvable" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[SONG EDIT PATCH]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
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

    const artist = await Artist.findOne({ userId: session.user.id });

    // Admin peut tout supprimer, artiste seulement ses sons
    const filter = session.user.role === "admin"
      ? { _id: id }
      : { _id: id, artist: artist?._id };

    await Song.findOneAndDelete(filter);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[SONG DELETE]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}