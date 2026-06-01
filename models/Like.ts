import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ILike extends Document {
  user: mongoose.Types.ObjectId;
  song: mongoose.Types.ObjectId;
  createdAt: Date;
}

const LikeSchema = new Schema<ILike>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    song: { type: Schema.Types.ObjectId, ref: "Song", required: true },
  },
  { timestamps: true }
);

LikeSchema.index({ user: 1, song: 1 }, { unique: true });

const Like: Model<ILike> =
  mongoose.models.Like ?? mongoose.model<ILike>("Like", LikeSchema);

export default Like;