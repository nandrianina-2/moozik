import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Artist from "@/models/Artist";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = req.nextUrl;
    const search = searchParams.get("q");

    const filter: Record<string, any> = {};
    if (search) filter.$text = { $search: search };

    const artists = await Artist.find(filter)
      .sort({ followersCount: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({
      artists: artists.map((a) => ({
        id:         (a._id as any).toString(),
        name:       a.name,
        slug:       a.slug,
        image:      a.image,
        isVerified: a.isVerified,
        followers:  a.followersCount,
        genres:     a.genres,
        userId:     a.userId?.toString(),
      })),
    });
  } catch (err) {
    console.error("[ARTISTS GET]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}