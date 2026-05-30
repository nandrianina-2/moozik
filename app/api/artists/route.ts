import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Artist from "@/models/Artist";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const search = searchParams.get("q");

    const filter: Record<string, any> = {};
    if (search) filter.$text = { $search: search };

    const artists = await Artist.find(filter)
      .sort({ followersCount: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      artists: artists.map((a) => ({
        ...a,
        id: a._id.toString(),
      })),
    });
  } catch (err) {
    console.error("[ARTISTS GET]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}