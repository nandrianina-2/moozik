import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Like from "@/models/Like";
import "@/models/Song";
import "@/models/Artist";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    await connectDB();

    const likes = await Like.find({ user: session.user.id })
      .populate({
        path: "song",
        populate: { path: "artist", select: "name slug image isVerified" },
      })
      .sort({ createdAt: -1 })
      .lean();

    const songs = likes
      .filter((l) => l.song)
      .map((l) => {
        const s = l.song as any;
        return {
          id: s._id.toString(),
          title: s.title ?? "",
          slug: s.slug ?? "",
          audioUrl: s.audioUrl ?? "",
          coverUrl: s.coverUrl,
          duration: s.duration ?? 0,
          genres: s.genres ?? [],
          streamCount: s.streamCount ?? 0,
          likesCount: s.likesCount ?? 0,
          isLiked: true,
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
        };
      });

    return NextResponse.json({ songs });
  } catch (err) {
    console.error("[LIKES GET]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}