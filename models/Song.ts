import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ISong extends Document {
  title: string;
  slug: string;
  audioUrl: string;
  coverUrl?: string;
  duration: number;
  artist: mongoose.Types.ObjectId;
  album?: mongoose.Types.ObjectId;
  genres: string[];
  streamCount: number;
  likesCount: number;
  lyrics?: string;
  isPublished: boolean;
  scheduledAt?: Date;
  releaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SongSchema = new Schema<ISong>(
  {
    title:       { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, lowercase: true },
    audioUrl:    { type: String, required: true },
    coverUrl:    { type: String },
    duration:    { type: Number, required: true, min: 0 },
    artist:      { type: Schema.Types.ObjectId, ref: "Artist", required: true },
    album:       { type: Schema.Types.ObjectId, ref: "Album" },
    genres:      [{ type: String }],
    streamCount: { type: Number, default: 0 },
    likesCount:  { type: Number, default: 0 },
    lyrics:      { type: String },
    isPublished: { type: Boolean, default: true },
    scheduledAt: { type: Date },
    releaseDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

SongSchema.index({ title: "text" });
SongSchema.index({ artist: 1, releaseDate: -1 });
SongSchema.index({ genres: 1 });
SongSchema.index({ streamCount: -1 });

const Song: Model<ISong> =
  mongoose.models.Song ?? mongoose.model<ISong>("Song", SongSchema);

export default Song;