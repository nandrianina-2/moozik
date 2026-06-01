import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  username?: string;   // add
  password?: string;
  image?: string;
  bio?: string;        // add
  role: "user" | "artist" | "admin";
  isPremium: boolean;
  premiumUntil?: Date;
  stripeCustomerId?: string;
  emailVerified?: Date;
  verifyToken?: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  following: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  coverImage:  { type: String },
  socialLinks: {
    instagram: { type: String },
    twitter:   { type: String },
    website:   { type: String },
  },
}

const UserSchema = new Schema<IUser>(
  {
    name:             { type: String, required: true, trim: true },
    email:            { type: String, required: true, unique: true, lowercase: true, trim: true },
    username:         { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    password:         { type: String, select: false },
    image:            { type: String },
    role:             { type: String, enum: ["user", "artist", "admin"], default: "user" },
    isPremium:        { type: Boolean, default: false },
    premiumUntil:     { type: Date },
    stripeCustomerId: { type: String },
    emailVerified:    { type: Date },
    verifyToken:      { type: String },
    resetToken:       { type: String },
    resetTokenExpiry: { type: Date },
    following:        [{ type: Schema.Types.ObjectId, ref: "Artist" }],
    bio:              { type: String, maxlength: 300 },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);

export default User;