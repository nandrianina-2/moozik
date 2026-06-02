import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Song from "@/models/Song";
import Artist from "@/models/Artist";
import Playlist from "@/models/Playlist";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const q = searchParams.get("q")?.trim();
    const type = searchParams.get("type") ?? "all";

    if (!q || q.length < 2) {
      return NextResponse.json({ songs: [], artists: [], playlists: [] });
    }

    await connectDB();

    // Regex insensible à la casse + accents
    const regex = new RegExp(
      q.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
      "i"
    );

    const [songs, artists, playlists] = await Promise.all([
      type === "all" || type === "songs"
        ? Song.find({
            isPublished: true,
            $or: [
              { title: { $regex: q, $options: "i" } },
              { genres: { $regex: q, $options: "i" } },
            ],
          })
            .populate("artist", "name slug image isVerified")
            .sort({ streamCount: -1 })
            .limit(10)
            .lean()
        : [],

      type === "all" || type === "artists"
        ? Artist.find({
            $or: [
              { name:  { $regex: q, $options: "i" } },
              { genres: { $regex: q, $options: "i" } },
              { bio:   { $regex: q, $options: "i" } },
            ],
          })
            .sort({ followersCount: -1 })
            .limit(6)
            .lean()
        : [],

      type === "all" || type === "playlists"
        ? Playlist.find({
            isPublic: true,
            name: { $regex: q, $options: "i" },
          })
            .limit(5)
            .lean()
        : [],
    ]);

    return NextResponse.json({
      songs: songs.map((s) => ({
        id:          (s._id as any).toString(),
        title:       s.title,
        slug:        s.slug,
        audioUrl:    s.audioUrl,
        coverUrl:    s.coverUrl,
        duration:    s.duration,
        streamCount: s.streamCount,
        likesCount:  s.likesCount,
        genres:      s.genres,
        isLiked:     false,
        releaseDate: s.releaseDate,
        artist: {
          id:         (s.artist as any)._id.toString(),
          name:       (s.artist as any).name,
          slug:       (s.artist as any).slug,
          image:      (s.artist as any).image,
          isVerified: (s.artist as any).isVerified,
          userId:     "",
          followers:  0,
          genres:     [],
        },
      })),
      artists: artists.map((a) => ({
        id:         (a._id as any).toString(),
        name:       a.name,
        slug:       a.slug,
        image:      a.image,
        isVerified: a.isVerified,
        followers:  a.followersCount,
        genres:     a.genres,
        userId:     "",
      })),
      playlists: playlists.map((p) => ({
        id:   (p._id as any).toString(),
        name: p.name,
        songsCount: (p.songs as any[]).length,
      })),
    });
  } catch (err) {
    console.error("[SEARCH]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}