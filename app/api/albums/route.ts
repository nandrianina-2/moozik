import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Album from "@/models/Album";
import Artist from "@/models/Artist";
import { slugify } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    await connectDB();

    const artist = await Artist.findOne({ userId: session.user.id });
    if (!artist) {
      return NextResponse.json({ error: "Artiste introuvable" }, { status: 404 });
    }

    const { title, songs, releaseDate } = await req.json();

    if (!title?.trim() || !songs?.length) {
      return NextResponse.json(
        { error: "Titre et sons requis" },
        { status: 400 }
      );
    }

    let slug = slugify(title);
    const existing = await Album.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;

    const album = await Album.create({
      title:       title.trim(),
      slug,
      artist:      artist._id,
      songs,
      releaseDate: releaseDate ? new Date(releaseDate) : new Date(),
      isPublished: true,
    });

    return NextResponse.json({
      id:    album._id.toString(),
      title: album.title,
    }, { status: 201 });
  } catch (err) {
    console.error("[ALBUM POST]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}