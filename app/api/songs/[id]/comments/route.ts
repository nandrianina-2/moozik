import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Comment from "@/models/Comment";
import "@/models/User"; // enregistre le schema User pour populate

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const comments = await Comment.find({ song: id })
      .populate("user", "name image")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({
      comments: comments.map((c) => ({
        id: c._id.toString(),
        content: c.content,
        timestamp: c.timestamp,
        likes: c.likes.length,
        createdAt: c.createdAt,
        user: {
          id: (c.user as any)._id.toString(),
          name: (c.user as any).name,
          image: (c.user as any).image,
        },
      })),
    });
  } catch (err) {
    console.error("[COMMENTS GET]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const { content, timestamp } = await req.json();

    if (!content?.trim()) {
      return NextResponse.json({ error: "Contenu requis" }, { status: 400 });
    }

    await connectDB();

    const comment = await Comment.create({
      song: id,
      user: session.user.id,
      content: content.trim(),
      timestamp: timestamp ?? null,
    });

    await comment.populate("user", "name image");

    return NextResponse.json({
      comment: {
        id: comment._id.toString(),
        content: comment.content,
        timestamp: comment.timestamp,
        likes: 0,
        createdAt: comment.createdAt,
        user: {
          id: session.user.id,
          name: (comment.user as any).name,
          image: (comment.user as any).image,
        },
      },
    }, { status: 201 });
  } catch (err) {
    console.error("[COMMENT POST]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}