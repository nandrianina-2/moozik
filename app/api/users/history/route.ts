import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import History from "@/models/History";
import "@/models/Song";
import "@/models/Artist";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    await connectDB();

    const history = await History.find({ user: session.user.id })
      .populate({
        path: "song",
        populate: { path: "artist", select: "name slug image isVerified" },
      })
      .sort({ playedAt: -1 })
      .limit(50)
      .lean();

    const songs = history
      .filter((h) => h.song)
      .map((h) => {
        const s = h.song as any;
        return {
          historyId: (h._id as any).toString(),
          playedAt:  h.playedAt,
          song: {
            id:          s._id.toString(),
            title:       s.title ?? "",
            slug:        s.slug ?? "",
            audioUrl:    s.audioUrl ?? "",
            coverUrl:    s.coverUrl,
            duration:    s.duration ?? 0,
            genres:      s.genres ?? [],
            streamCount: s.streamCount ?? 0,
            likesCount:  s.likesCount ?? 0,
            isLiked:     false,
            releaseDate: new Date(s.releaseDate),
            artist: {
              id:         s.artist._id.toString(),
              name:       s.artist.name ?? "",
              slug:       s.artist.slug ?? "",
              image:      s.artist.image,
              isVerified: s.artist.isVerified ?? false,
              userId:     "",
              followers:  0,
              genres:     [],
            },
          },
        };
      });

    return NextResponse.json({ songs });
  } catch (err) {
    console.error("[HISTORY GET]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    await connectDB();
    await History.deleteMany({ user: session.user.id });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[HISTORY DELETE]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}