import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[WEBHOOK] Signature invalide", err);
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  await connectDB();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as any;
      const userId  = session.metadata?.userId;
      const plan    = session.metadata?.plan;

      if (userId) {
        await User.findByIdAndUpdate(userId, {
          isPremium:        true,
          premiumUntil:     new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          stripeCustomerId: session.customer,
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub      = event.data.object as any;
      const customer = sub.customer;

      await User.findOneAndUpdate(
        { stripeCustomerId: customer },
        { isPremium: false, premiumUntil: null }
      );
      break;
    }

    case "invoice.payment_failed": {
      const invoice  = event.data.object as any;
      const customer = invoice.customer;

      await User.findOneAndUpdate(
        { stripeCustomerId: customer },
        { isPremium: false }
      );
      break;
    }
  }

  return NextResponse.json({ received: true });
}