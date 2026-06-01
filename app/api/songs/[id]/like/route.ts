import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Song from "@/models/Song";
import Like from "@/models/Like";

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

    const existing = await Like.findOne({
      user: session.user.id,
      song: id,
    });

    if (existing) {
      await Like.deleteOne({ _id: existing._id });
      await Song.findByIdAndUpdate(id, { $inc: { likesCount: -1 } });
      return NextResponse.json({ liked: false });
    } else {
      await Like.create({ user: session.user.id, song: id });
      await Song.findByIdAndUpdate(id, { $inc: { likesCount: 1 } });
      return NextResponse.json({ liked: true });
    }
  } catch (err) {
    console.error("[LIKE]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ liked: false });
    }

    const { id } = await params;
    await connectDB();

    const like = await Like.findOne({ user: session.user.id, song: id });
    return NextResponse.json({ liked: !!like });
  } catch {
    return NextResponse.json({ liked: false });
  }
}