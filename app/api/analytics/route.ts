import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Artist from "@/models/Artist";
import StreamEvent from "@/models/StreamEvent";
import Song from "@/models/Song";
import Like from "@/models/Like";

// Taux par stream selon le plan (en euros)
const STREAM_RATES = {
  premium: 0.004,  // 0.4 centime par stream premium
  free:    0.001,  // 0.1 centime par stream gratuit
};

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
    const days   = period === "30d" ? 30 : period === "90d" ? 90 : 7;
    const since  = new Date();
    since.setDate(since.getDate() - days);

    const songs   = await Song.find({ artist: artist._id })
      .select("_id title streamCount likesCount");
    const songIds = songs.map((s) => s._id);

    // Streams par jour
    const streamsByDay = await StreamEvent.aggregate([
      { $match: { artist: artist._id, createdAt: { $gte: since } } },
      {
        $group: {
          _id:   { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Streams par son
    const streamsBySong = await StreamEvent.aggregate([
      { $match: { artist: artist._id, createdAt: { $gte: since } } },
      { $group: { _id: "$song", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const topSongs = streamsBySong.map((s) => {
      const song = songs.find((sg) => sg._id.toString() === s._id.toString());
      return { title: song?.title ?? "Inconnu", streams: s.count };
    });

    // Likes sur la période
    const totalLikesPeriod = await Like.countDocuments({
      song:      { $in: songIds },
      createdAt: { $gte: since },
    });

    const totalStreams = streamsByDay.reduce((a, d) => a + d.count, 0);

    // Calcul revenus estimés
    // On suppose 30% streams premium, 70% gratuits (estimation)
    const premiumStreams = Math.floor(totalStreams * 0.3);
    const freeStreams    = totalStreams - premiumStreams;
    const estimatedRevenue =
      premiumStreams * STREAM_RATES.premium +
      freeStreams    * STREAM_RATES.free;

    // Revenus par son
    const revenueByDay = await Promise.all(
      streamsByDay.map(async (d) => {
        const dayPremium = Math.floor(d.count * 0.3);
        const dayFree    = d.count - dayPremium;
        const revenue    =
          dayPremium * STREAM_RATES.premium +
          dayFree    * STREAM_RATES.free;
        return { date: d._id, streams: d.count, revenue };
      })
    );

    // Remplir les jours manquants
    const filledDays: {
      date: string;
      streams: number;
      revenue: number;
    }[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const found   = revenueByDay.find((s) => s.date === dateStr);
      filledDays.push({
        date:    dateStr,
        streams: found?.streams  ?? 0,
        revenue: found?.revenue  ?? 0,
      });
    }

    // Projection mensuelle
    const avgDailyStreams  = totalStreams / days;
    const monthlyProjected = avgDailyStreams * 30 *
      (0.3 * STREAM_RATES.premium + 0.7 * STREAM_RATES.free);

    return NextResponse.json({
      period,
      totalStreams,
      totalLikes:        totalLikesPeriod,
      totalSongs:        songs.length,
      estimatedRevenue,
      monthlyProjected,
      streamsByDay:      filledDays,
      topSongs,
      allSongs: songs.map((s) => ({
        id:          s._id.toString(),
        title:       s.title,
        streamCount: s.streamCount,
        likesCount:  s.likesCount,
        revenue:     (
          Math.floor(s.streamCount * 0.3) * STREAM_RATES.premium +
          Math.floor(s.streamCount * 0.7) * STREAM_RATES.free
        ),
      })),
    });
  } catch (err) {
    console.error("[ANALYTICS]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}