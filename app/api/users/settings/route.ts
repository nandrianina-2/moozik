import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import UserSettings from "@/models/UserSettings";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    await connectDB();

    const settings = await UserSettings.findOneAndUpdate(
      { user: session.user.id },
      { $setOnInsert: { user: session.user.id } },
      { upsert: true, new: true }
    ).lean();

    return NextResponse.json({ notifications: (settings as any).notifications });
  } catch (err) {
    console.error("[SETTINGS GET]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { notifications } = await req.json();
    await connectDB();

    await UserSettings.findOneAndUpdate(
      { user: session.user.id },
      { $set: { notifications } },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[SETTINGS PATCH]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}