import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IPushSubscription extends Document {
  user:         mongoose.Types.ObjectId;
  endpoint:     string;
  keys: {
    p256dh: string;
    auth:   string;
  };
  createdAt: Date;
}

const PushSubscriptionSchema = new Schema<IPushSubscription>(
  {
    user:     { type: Schema.Types.ObjectId, ref: "User", required: true },
    endpoint: { type: String, required: true, unique: true },
    keys: {
      p256dh: { type: String, required: true },
      auth:   { type: String, required: true },
    },
  },
  { timestamps: true }
);

const PushSubscription: Model<IPushSubscription> =
  mongoose.models.PushSubscription ??
  mongoose.model<IPushSubscription>("PushSubscription", PushSubscriptionSchema);

export default PushSubscription;