import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Song from "@/models/Song";
import Artist from "@/models/Artist";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = req.nextUrl;
    const page  = parseInt(searchParams.get("page")  ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const genre  = searchParams.get("genre");
    const artist = searchParams.get("artist");
    const search = searchParams.get("q");
    const sort   = searchParams.get("sort") ?? "recent";

    const filter: Record<string, any> = {
      isPublished: true,
      $or: [
        { scheduledAt: { $exists: false } },
        { scheduledAt: { $lte: new Date() } },
      ],
    };

    if (genre)  filter.genres = genre;
    if (artist) filter.artist = artist;
    if (search) {
      filter.$or = [
        { title:  { $regex: search, $options: "i" } },
        { genres: { $regex: search, $options: "i" } },
      ];
    }

    const sortMap: Record<string, any> = {
      recent:  { releaseDate: -1 },
      popular: { streamCount: -1 },
      liked:   { likesCount:  -1 },
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
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("[SONGS GET]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    await connectDB();

    const {
      title, audioUrl, coverUrl, duration,
      genres, lyrics, releaseDate, isPublished,
      scheduledAt, artistId,
    } = await req.json();

    if (!title?.trim() || !audioUrl) {
      return NextResponse.json(
        { error: "Titre et audio requis" },
        { status: 400 }
      );
    }

    let targetArtist;

    if (session.user.role === "admin" && artistId) {
      // Admin assigne à un artiste spécifique
      targetArtist = await Artist.findById(artistId);
    } else {
      // Artiste uploade pour lui-même
      targetArtist = await Artist.findOne({ userId: session.user.id });
    }

    if (!targetArtist) {
      return NextResponse.json(
        { error: "Profil artiste introuvable" },
        { status: 404 }
      );
    }

    let slug = slugify(title);
    const existing = await Song.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;

    const song = await Song.create({
      title:       title.trim(),
      slug,
      audioUrl,
      coverUrl,
      duration:    duration ?? 0,
      artist:      targetArtist._id,
      genres:      genres ?? [],
      lyrics,
      isPublished: isPublished ?? true,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      releaseDate: releaseDate ? new Date(releaseDate) : new Date(),
    });

    return NextResponse.json({
      id:    song._id.toString(),
      title: song.title,
    }, { status: 201 });
  } catch (err: any) {
    console.error("[SONG POST]", err?.message);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}