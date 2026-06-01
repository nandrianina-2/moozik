import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IStreamEvent extends Document {
  song: mongoose.Types.ObjectId;
  artist: mongoose.Types.ObjectId;
  user?: mongoose.Types.ObjectId;
  country?: string;
  createdAt: Date;
}

const StreamEventSchema = new Schema<IStreamEvent>(
  {
    song:    { type: Schema.Types.ObjectId, ref: "Song",   required: true },
    artist:  { type: Schema.Types.ObjectId, ref: "Artist", required: true },
    user:    { type: Schema.Types.ObjectId, ref: "User" },
    country: { type: String },
  },
  { timestamps: true }
);

StreamEventSchema.index({ artist: 1, createdAt: -1 });
StreamEventSchema.index({ song: 1, createdAt: -1 });

const StreamEvent: Model<IStreamEvent> =
  mongoose.models.StreamEvent ??
  mongoose.model<IStreamEvent>("StreamEvent", StreamEventSchema);

export default StreamEvent;