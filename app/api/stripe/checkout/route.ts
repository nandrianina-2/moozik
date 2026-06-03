import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { stripe, PLANS } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { plan } = await req.json();
    if (!PLANS[plan as keyof typeof PLANS]) {
      return NextResponse.json({ error: "Plan invalide" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    // Crée ou récupère le customer Stripe
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email as string,
        name:  user.name as string,
        metadata: { userId: session.user.id },
      });
      customerId = customer.id;
      await User.findByIdAndUpdate(session.user.id, {
        stripeCustomerId: customerId,
      });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const checkout = await stripe.checkout.sessions.create({
      customer:   customerId,
      mode:       "subscription",
      line_items: [
        {
          price:    PLANS[plan as keyof typeof PLANS].priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/subscription?success=true`,
      cancel_url:  `${appUrl}/subscription?canceled=true`,
      metadata:    { userId: session.user.id, plan },
    });

    return NextResponse.json({ url: checkout.url });
  } catch (err) {
    console.error("[STRIPE CHECKOUT]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}