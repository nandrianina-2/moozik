import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IComment extends Document {
  song: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  content: string;
  timestamp?: number;
  likes: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    song:      { type: Schema.Types.ObjectId, ref: "Song", required: true },
    user:      { type: Schema.Types.ObjectId, ref: "User", required: true },
    content:   { type: String, required: true, maxlength: 500, trim: true },
    timestamp: { type: Number, min: 0 },
    likes:     [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

CommentSchema.index({ song: 1, createdAt: -1 });

const Comment: Model<IComment> =
  mongoose.models.Comment ?? mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;