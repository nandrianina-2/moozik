import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IHistory extends Document {
  user: mongoose.Types.ObjectId;
  song: mongoose.Types.ObjectId;
  playedAt: Date;
}

const HistorySchema = new Schema<IHistory>({
  user:     { type: Schema.Types.ObjectId, ref: "User",   required: true },
  song:     { type: Schema.Types.ObjectId, ref: "Song",   required: true },
  playedAt: { type: Date, default: Date.now },
});

HistorySchema.index({ user: 1, playedAt: -1 });

const History: Model<IHistory> =
  mongoose.models.History ??
  mongoose.model<IHistory>("History", HistorySchema);

export default History;