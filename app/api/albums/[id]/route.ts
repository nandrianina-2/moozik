import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Album from "@/models/Album";
import Artist from "@/models/Artist";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    await connectDB();

    const artist = await Artist.findOne({ userId: session.user.id });
    const filter = session.user.role === "admin"
      ? { _id: id }
      : { _id: id, artist: artist?._id };

    await Album.findOneAndUpdate(filter, { $set: body });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[ALBUM PATCH]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
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

    const artist = await Artist.findOne({ userId: session.user.id });
    const filter = session.user.role === "admin"
      ? { _id: id }
      : { _id: id, artist: artist?._id };

    await Album.findOneAndDelete(filter);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[ALBUM DELETE]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}