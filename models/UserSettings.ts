import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IUserSettings extends Document {
  user:          mongoose.Types.ObjectId;
  notifications: {
    followers: boolean;
    likes:     boolean;
    comments:  boolean;
    newSongs:  boolean;
    push:      boolean;
  };
}

const UserSettingsSchema = new Schema<IUserSettings>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  notifications: {
    followers: { type: Boolean, default: true },
    likes:     { type: Boolean, default: true },
    comments:  { type: Boolean, default: true },
    newSongs:  { type: Boolean, default: true },
    push:      { type: Boolean, default: false },
  },
});

const UserSettings: Model<IUserSettings> =
  mongoose.models.UserSettings ??
  mongoose.model<IUserSettings>("UserSettings", UserSettingsSchema);

export default UserSettings;