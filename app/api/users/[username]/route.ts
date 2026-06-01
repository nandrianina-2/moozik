import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Playlist from "@/models/Playlist";
import Like from "@/models/Like";
import "@/models/Song";
import "@/models/Artist";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    await connectDB();

    const user = await User.findOne({ username }).lean();
    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    // Playlists publiques
    const playlists = await Playlist.find({
      user: user._id,
      isPublic: true,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Nombre de favoris
    const likesCount = await Like.countDocuments({ user: user._id });

    return NextResponse.json({
      profile: {
        id:        (user._id as any).toString(),
        name:      user.name,
        username:  user.username,
        image:     user.image,
        bio:       (user as any).bio,
        isPremium: user.isPremium,
        role:      user.role,
        createdAt: user.createdAt,
        likesCount,
      },
      playlists: playlists.map((p) => ({
        id:       (p._id as any).toString(),
        name:     p.name,
        description: p.description,
        isPublic: p.isPublic,
        songsCount: (p.songs as any[]).length,
      })),
    });
  } catch (err) {
    console.error("[USER PROFILE GET]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}