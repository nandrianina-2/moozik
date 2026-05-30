import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Song from "@/models/Song";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const genre = searchParams.get("genre");
    const artist = searchParams.get("artist");
    const search = searchParams.get("q");
    const sort = searchParams.get("sort") ?? "recent";

    const filter: Record<string, any> = { isPublished: true };
    if (genre) filter.genres = genre;
    if (artist) filter.artist = artist;
    if (search) filter.$text = { $search: search };

    const sortMap: Record<string, any> = {
      recent: { releaseDate: -1 },
      popular: { streamCount: -1 },
      liked: { likesCount: -1 },
    };

    const songs = await Song.find(filter)
      .populate("artist", "name slug image isVerified")
      .sort(sortMap[sort] ?? sortMap.recent)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Song.countDocuments(filter);

    return NextResponse.json({
      songs: songs.map((s) => ({
        ...s,
        id: s._id.toString(),
        artist: {
          ...(s.artist as any),
          id: (s.artist as any)._id.toString(),
        },
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("[SONGS GET]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}