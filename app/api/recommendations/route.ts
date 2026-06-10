import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getRecommendations } from "@/lib/recommendations";
import { connectDB } from "@/lib/db";
import Song from "@/models/Song";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = req.nextUrl;
    const limit   = parseInt(searchParams.get("limit") ?? "20");
    const exclude = searchParams.get("exclude")?.split(",") ?? [];

    // Utilisateur connecté → recommandations personnalisées
    if (session?.user?.id) {
      const result = await getRecommendations({
        userId: session.user.id,
        limit,
        exclude,
      });
      return NextResponse.json(result);
    }

    // Non connecté → sons populaires
    await connectDB();
    const songs = await Song.find({ isPublished: true })
      .populate("artist", "name slug image isVerified")
      .sort({ streamCount: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      songs: songs.map((s) => ({
        id:          (s._id as any).toString(),
        title:       s.title,
        slug:        s.slug,
        audioUrl:    s.audioUrl,
        coverUrl:    s.coverUrl,
        duration:    s.duration,
        genres:      s.genres ?? [],
        streamCount: s.streamCount ?? 0,
        likesCount:  s.likesCount ?? 0,
        isLiked:     false,
        releaseDate: new Date(s.releaseDate as Date),
        reason:      "trending",
        artist: {
          id:         (s.artist as any)._id.toString(),
          name:       (s.artist as any).name ?? "",
          slug:       (s.artist as any).slug ?? "",
          image:      (s.artist as any).image,
          isVerified: (s.artist as any).isVerified ?? false,
          userId:     "",
          followers:  0,
          genres:     [],
        },
      })),
      topGenres:  [],
      hasHistory: false,
    });
  } catch (err) {
    console.error("[RECOMMENDATIONS]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}