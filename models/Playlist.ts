import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IPlaylist extends Document {
  name: string;
  description?: string;
  coverUrl?: string;
  user: mongoose.Types.ObjectId;
  songs: mongoose.Types.ObjectId[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PlaylistSchema = new Schema<IPlaylist>(
  {
    name:        { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, maxlength: 500 },
    coverUrl:    { type: String },
    user:        { type: Schema.Types.ObjectId, ref: "User", required: true },
    songs:       [{ type: Schema.Types.ObjectId, ref: "Song" }],
    isPublic:    { type: Boolean, default: false },
  },
  { timestamps: true }
);

PlaylistSchema.index({ user: 1, createdAt: -1 });

const Playlist: Model<IPlaylist> =
  mongoose.models.Playlist ?? mongoose.model<IPlaylist>("Playlist", PlaylistSchema);

export default Playlist;