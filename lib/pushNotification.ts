import webpush from "web-push";
import { connectDB } from "@/lib/db";
import PushSubscription from "@/models/PushSubscription";
import mongoose from "mongoose";

webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function sendPushToUser(
  userId: string,
  payload: {
    title:  string;
    body:   string;
    icon?:  string;
    url?:   string;
  }
) {
  await connectDB();

  const subs = await PushSubscription.find({
    user: new mongoose.Types.ObjectId(userId),
  }).lean();

  const results = await Promise.allSettled(
    subs.map((sub) =>
      webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys:     { p256dh: sub.keys.p256dh, auth: sub.keys.auth },
        },
        JSON.stringify(payload)
      )
    )
  );

  // Supprime les subscriptions expirées
  const expired = results
    .map((r, i) => ({ r, sub: subs[i] }))
    .filter(({ r }) => r.status === "rejected")
    .map(({ sub }) => sub.endpoint);

  if (expired.length > 0) {
    await PushSubscription.deleteMany({ endpoint: { $in: expired } });
  }
}