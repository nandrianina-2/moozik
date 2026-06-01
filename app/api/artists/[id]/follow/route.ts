import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Artist from "@/models/Artist";
import User from "@/models/User";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    const isFollowing = user.following.some(
      (f) => f.toString() === id
    );

    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(session.user.id, {
        $pull: { following: id },
      });
      await Artist.findByIdAndUpdate(id, {
        $inc: { followersCount: -1 },
      });
      return NextResponse.json({ following: false });
    } else {
      // Follow
      await User.findByIdAndUpdate(session.user.id, {
        $addToSet: { following: id },
      });
      await Artist.findByIdAndUpdate(id, {
        $inc: { followersCount: 1 },
      });
      return NextResponse.json({ following: true });
    }
  } catch (err) {
    console.error("[FOLLOW]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}