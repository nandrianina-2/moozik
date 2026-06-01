import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  type: "like" | "comment" | "follow" | "new_song";
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    user:    { type: Schema.Types.ObjectId, ref: "User", required: true },
    type:    { type: String, enum: ["like", "comment", "follow", "new_song"], required: true },
    message: { type: String, required: true },
    link:    { type: String },
    isRead:  { type: Boolean, default: false },
  },
  { timestamps: true }
);

NotificationSchema.index({ user: 1, createdAt: -1 });

const Notification: Model<INotification> =
  mongoose.models.Notification ??
  mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;