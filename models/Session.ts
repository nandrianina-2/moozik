import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ISession extends Document {
  user:      mongoose.Types.ObjectId;
  token:     string;
  userAgent: string;
  ip:        string;
  lastSeen:  Date;
  createdAt: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    user:      { type: Schema.Types.ObjectId, ref: "User", required: true },
    token:     { type: String, required: true, unique: true },
    userAgent: { type: String, default: "" },
    ip:        { type: String, default: "" },
    lastSeen:  { type: Date, default: Date.now },
  },
  { timestamps: true }
);

SessionSchema.index({ user: 1, lastSeen: -1 });

const Session: Model<ISession> =
  mongoose.models.Session ??
  mongoose.model<ISession>("Session", SessionSchema);

export default Session;