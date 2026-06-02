import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Song from "@/models/Song";
import StreamEvent from "@/models/StreamEvent";
import History from "@/models/History";
import { rateLimit } from "@/lib/rateLimit";


export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

// Au début du POST, avant connectDB :
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    const { success } = rateLimit(`play:${ip}:${id}`, 5, 30_000);

    if (!success) {
      return NextResponse.json({ error: "Trop de requêtes" }, { status: 429 });
    }
    
    await connectDB();

    const song = await Song.findById(id).select("artist streamCount");
    if (!song) {
      return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    }

    const session = await auth();

    await Song.findByIdAndUpdate(id, { $inc: { streamCount: 1 } });

    await StreamEvent.create({
      song:   song._id,
      artist: song.artist,
      user:   session?.user?.id ?? undefined,
    });

    // Historique user connecté
    if (session?.user?.id) {
      // Retire l'entrée précédente du même son pour éviter les doublons
      await History.deleteOne({ user: session.user.id, song: song._id });
      await History.create({
        user:     session.user.id,
        song:     song._id,
        playedAt: new Date(),
      });

      // Garde max 100 entrées par user
      const count = await History.countDocuments({ user: session.user.id });
      if (count > 100) {
        const oldest = await History.find({ user: session.user.id })
          .sort({ playedAt: 1 })
          .limit(count - 100)
          .select("_id");
        await History.deleteMany({ _id: { $in: oldest.map((h) => h._id) } });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[PLAY]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}