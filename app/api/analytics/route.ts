import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Artist from "@/models/Artist";
import StreamEvent from "@/models/StreamEvent";
import Song from "@/models/Song";
import Like from "@/models/Like";

export async function GET(req: NextRequest) {
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

    const { searchParams } = req.nextUrl;
    const period = searchParams.get("period") ?? "7d";

    const days = period === "30d" ? 30 : period === "90d" ? 90 : 7;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const songs = await Song.find({ artist: artist._id }).select("_id title streamCount likesCount");
    const songIds = songs.map((s) => s._id);

    // Streams par jour
    const streamsByDay = await StreamEvent.aggregate([
      {
        $match: {
          artist: artist._id,
          createdAt: { $gte: since },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Streams par son
    const streamsBySong = await StreamEvent.aggregate([
      {
        $match: {
          artist: artist._id,
          createdAt: { $gte: since },
        },
      },
      {
        $group: {
          _id: "$song",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Enrichir avec les titres
    const topSongs = streamsBySong.map((s) => {
      const song = songs.find((sg) => sg._id.toString() === s._id.toString());
      return {
        title: song?.title ?? "Inconnu",
        streams: s.count,
      };
    });

    // Total likes sur la période
    const totalLikesperiod = await Like.countDocuments({
      song: { $in: songIds },
      createdAt: { $gte: since },
    });

    // Total streams sur la période
    const totalStreams = streamsByDay.reduce((a, d) => a + d.count, 0);

    // Remplir les jours manquants
    const filledDays: { date: string; streams: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const found = streamsByDay.find((s) => s._id === dateStr);
      filledDays.push({ date: dateStr, streams: found?.count ?? 0 });
    }

    return NextResponse.json({
      period,
      totalStreams,
      totalLikes: totalLikesperiod,
      totalSongs: songs.length,
      streamsByDay: filledDays,
      topSongs,
      allSongs: songs.map((s) => ({
        id: s._id.toString(),
        title: s.title,
        streamCount: s.streamCount,
        likesCount: s.likesCount,
      })),
    });
  } catch (err) {
    console.error("[ANALYTICS]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}