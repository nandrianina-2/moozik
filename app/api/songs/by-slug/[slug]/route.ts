import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Song from "@/models/Song";
import "@/models/Artist";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectDB();

    const song = await Song.findOne({ slug, isPublished: true })
      .populate("artist", "name slug image isVerified followersCount")
      .lean();

    if (!song) {
      return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    }

    return NextResponse.json({
      id:          (song._id as any).toString(),
      title:       song.title,
      slug:        song.slug,
      audioUrl:    song.audioUrl,
      coverUrl:    song.coverUrl,
      duration:    song.duration,
      genres:      song.genres,
      streamCount: song.streamCount,
      likesCount:  song.likesCount,
      lyrics:      song.lyrics,
      releaseDate: song.releaseDate,
      artist: {
        id:         (song.artist as any)._id.toString(),
        name:       (song.artist as any).name,
        slug:       (song.artist as any).slug,
        image:      (song.artist as any).image,
        isVerified: (song.artist as any).isVerified,
        followers:  (song.artist as any).followersCount,
        userId:     "",
        genres:     [],
      },
    });
  } catch (err) {
    console.error("[SONG BY SLUG]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}