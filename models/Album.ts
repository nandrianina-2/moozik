import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IAlbum extends Document {
  title: string;
  slug: string;
  coverUrl?: string;
  artist: mongoose.Types.ObjectId;
  songs: mongoose.Types.ObjectId[];
  releaseDate: Date;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AlbumSchema = new Schema<IAlbum>(
  {
    title:       { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, lowercase: true },
    coverUrl:    { type: String },
    artist:      { type: Schema.Types.ObjectId, ref: "Artist", required: true },
    songs:       [{ type: Schema.Types.ObjectId, ref: "Song" }],
    releaseDate: { type: Date, default: Date.now },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

AlbumSchema.index({ artist: 1, releaseDate: -1 });

const Album: Model<IAlbum> =
  mongoose.models.Album ?? mongoose.model<IAlbum>("Album", AlbumSchema);

export default Album;