import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Playlist from "@/models/Playlist";

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

    const playlist = await Playlist.findOne({
      _id: id,
      user: session.user.id,
    })
      .populate({
        path: "songs",
        populate: { path: "artist", select: "name slug image isVerified" },
      })
      .lean();

    if (!playlist) {
      return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    }

    return NextResponse.json({
      playlist: {
        id: (playlist._id as any).toString(),
        name: playlist.name,
        description: playlist.description,
        isPublic: playlist.isPublic,
        createdAt: playlist.createdAt,
        songs: (playlist.songs as any[]).map((s) => ({
          id: s._id.toString(),
          title: s.title ?? "",
          slug: s.slug ?? "",
          audioUrl: s.audioUrl ?? "",
          coverUrl: s.coverUrl,
          duration: s.duration ?? 0,
          genres: s.genres ?? [],
          streamCount: s.streamCount ?? 0,
          likesCount: s.likesCount ?? 0,
          isLiked: false,
          releaseDate: new Date(s.releaseDate),
          artist: {
            id: s.artist._id.toString(),
            name: s.artist.name ?? "",
            slug: s.artist.slug ?? "",
            image: s.artist.image,
            isVerified: s.artist.isVerified ?? false,
            userId: "",
            followers: 0,
            genres: [],
          },
        })),
      },
    });
  } catch (err) {
    console.error("[PLAYLIST GET]", err);
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

    const playlist = await Playlist.findOneAndUpdate(
      { _id: id, user: session.user.id },
      { $set: body },
      { new: true }
    );

    if (!playlist) {
      return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[PLAYLIST PATCH]", err);
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

    await Playlist.findOneAndDelete({ _id: id, user: session.user.id });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[PLAYLIST DELETE]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}