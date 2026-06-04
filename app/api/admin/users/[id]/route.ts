import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Artist from "@/models/Artist";
import { slugify } from "@/lib/utils";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    await connectDB();

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    }

    // Si on change le rôle vers "artist" → crée automatiquement le profil Artist
    if (body.role === "artist" && user.role !== "artist") {
      const existingArtist = await Artist.findOne({ userId: id });
      if (!existingArtist) {
        let slug = slugify(user.name as string);
        const existing = await Artist.findOne({ slug });
        if (existing) slug = `${slug}-${Date.now()}`;

        await Artist.create({
          name:           user.name,
          slug,
          userId:         user._id,
          isVerified:     false,
          followersCount: 0,
          genres:         [],
          image:          user.image,
        });
      }
    }

    await User.findByIdAndUpdate(id, { $set: body });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[ADMIN USER PATCH]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}