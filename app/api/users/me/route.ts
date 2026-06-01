import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Artist from "@/models/Artist";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id)
      .select("name email image username bio role isPremium coverImage socialLinks")
      .lean();

    if (!user) {
      return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    }

    // Si artiste — charge les données Artist pour fusionner
    let artistData = null;
    if (user.role === "artist" || user.role === "admin") {
      artistData = await Artist.findOne({ userId: user._id })
        .select("name bio image coverImage socialLinks slug isVerified followersCount genres")
        .lean();
    }

    return NextResponse.json({
      id:          (user._id as any).toString(),
      name:        user.name,
      email:       user.email,
      // Priorité : Artist > User pour les images si artiste
      image:       artistData?.image ?? (user as any).image,
      username:    (user as any).username,
      bio:         artistData?.bio ?? (user as any).bio,
      role:        user.role,
      isPremium:   user.isPremium,
      coverImage:  artistData?.coverImage ?? (user as any).coverImage,
      socialLinks: (artistData as any)?.socialLinks ?? (user as any).socialLinks ?? {
        instagram: "", twitter: "", website: "",
      },
      // Données artiste si applicable
      artist: artistData ? {
        slug:           artistData.slug,
        isVerified:     artistData.isVerified,
        followersCount: artistData.followersCount,
        genres:         artistData.genres,
      } : null,
    });
  } catch (err) {
    console.error("[ME GET]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    await connectDB();

    // Vérifie unicité username
    if (body.username) {
      const existing = await User.findOne({
        username: body.username,
        _id: { $ne: session.user.id },
      });
      if (existing) {
        return NextResponse.json(
          { error: "Ce nom d'utilisateur est déjà pris" },
          { status: 409 }
        );
      }
    }

    // Update User
    const userAllowed = ["name", "username", "bio", "image", "coverImage", "socialLinks"];
    const userUpdate: Record<string, any> = {};
    for (const key of userAllowed) {
      if (body[key] !== undefined) userUpdate[key] = body[key];
    }
    await User.findByIdAndUpdate(session.user.id, { $set: userUpdate });

    // Si artiste — sync Artist aussi
    const user = await User.findById(session.user.id).select("role").lean();
    if (user?.role === "artist" || user?.role === "admin") {
      const artistAllowed = ["name", "bio", "image", "coverImage", "socialLinks"];
      const artistUpdate: Record<string, any> = {};
      for (const key of artistAllowed) {
        if (body[key] !== undefined) artistUpdate[key] = body[key];
      }
      if (Object.keys(artistUpdate).length > 0) {
        await Artist.findOneAndUpdate(
          { userId: session.user.id },
          { $set: artistUpdate }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[ME PATCH]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    await connectDB();
    await User.findByIdAndDelete(session.user.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[ME DELETE]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}