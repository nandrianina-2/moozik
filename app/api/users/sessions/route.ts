import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Session from "@/models/Session";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    await connectDB();

    const sessions = await Session.find({ user: session.user.id })
      .sort({ lastSeen: -1 })
      .limit(10)
      .lean();

    // Token de la session courante
    const cookieStore = await cookies();
    const currentToken =
      cookieStore.get("authjs.session-token")?.value ??
      cookieStore.get("__Secure-authjs.session-token")?.value ?? "";

    return NextResponse.json({
      sessions: sessions.map((s) => ({
        id:        (s._id as any).toString(),
        userAgent: s.userAgent,
        ip:        s.ip,
        lastSeen:  s.lastSeen,
        createdAt: s.createdAt,
        isCurrent: s.token === currentToken,
      })),
    });
  } catch (err) {
    console.error("[SESSIONS GET]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { sessionId } = await req.json();
    await connectDB();

    await Session.findOneAndDelete({
      _id:  sessionId,
      user: session.user.id,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[SESSION DELETE]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}