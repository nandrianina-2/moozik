import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { stripe } from "@/lib/stripe";

export async function POST() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.user.id);

    if (!user?.stripeCustomerId) {
      return NextResponse.json(
        { error: "Aucun abonnement actif" },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const portal = await stripe.billingPortal.sessions.create({
      customer:   user.stripeCustomerId as string,
      return_url: `${appUrl}/subscription`,
    });

    return NextResponse.json({ url: portal.url });
  } catch (err) {
    console.error("[STRIPE PORTAL]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}