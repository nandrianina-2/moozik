import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IArtist extends Document {
  name: string;
  slug: string;
  bio?: string;
  image?: string;
  coverImage?: string;
  isVerified: boolean;
  userId: mongoose.Types.ObjectId;
  genres: string[];
  followersCount: number;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    website?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ArtistSchema = new Schema<IArtist>(
  {
    name:           { type: String, required: true, trim: true },
    slug:           { type: String, required: true, unique: true, lowercase: true },
    bio:            { type: String, maxlength: 1000 },
    image:          { type: String },
    coverImage:     { type: String },
    isVerified:     { type: Boolean, default: false },
    userId:         { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    genres:         [{ type: String }],
    followersCount: { type: Number, default: 0 },
    socialLinks: {
      instagram: String,
      twitter:   String,
      website:   String,
    },
  },
  { timestamps: true }
);

ArtistSchema.index({ slug: 1 });
ArtistSchema.index({ name: "text", bio: "text" });

const Artist: Model<IArtist> =
  mongoose.models.Artist ?? mongoose.model<IArtist>("Artist", ArtistSchema);

export default Artist;