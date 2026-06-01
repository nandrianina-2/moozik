import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI!;

// ── Schemas inline (évite les imports circulaires) ──────────────────────────

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  image: String,
  role: { type: String, default: "user" },
  isPremium: { type: Boolean, default: false },
  emailVerified: Date,
  following: [mongoose.Schema.Types.ObjectId],
}, { timestamps: true });

const ArtistSchema = new mongoose.Schema({
  name: String,
  slug: { type: String, unique: true },
  bio: String,
  image: String,
  coverImage: String,
  isVerified: { type: Boolean, default: false },
  userId: mongoose.Schema.Types.ObjectId,
  genres: [String],
  followersCount: { type: Number, default: 0 },
}, { timestamps: true });

const SongSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  audioUrl: String,
  coverUrl: String,
  duration: Number,
  artist: { type: mongoose.Schema.Types.ObjectId, ref: "Artist" },
  genres: [String],
  streamCount: { type: Number, default: 0 },
  likesCount: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
  releaseDate: { type: Date, default: Date.now },
}, { timestamps: true });

const AlbumSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  coverUrl: String,
  artist: { type: mongoose.Schema.Types.ObjectId, ref: "Artist" },
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
  releaseDate: { type: Date, default: Date.now },
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

// ── Données de test ──────────────────────────────────────────────────────────

const artists = [
  {
    name: "Neon Pulse",
    slug: "neon-pulse",
    bio: "Producteur électronique basé à Paris. Mélanges de synthwave et d'ambient.",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    coverImage: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800",
    isVerified: true,
    genres: ["Electronic", "Synthwave"],
    followersCount: 12400,
  },
  {
    name: "Luna Vox",
    slug: "luna-vox",
    bio: "Chanteuse et compositrice. Influence jazz, soul et R&B.",
    image: "https://images.unsplash.com/photo-1516575334481-f85287c2c82d?w=400",
    coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
    isVerified: true,
    genres: ["Jazz", "Soul", "R&B"],
    followersCount: 8900,
  },
  {
    name: "DarkWave",
    slug: "darkwave",
    bio: "Duo de musique alternative. Sons sombres et mélodiques.",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400",
    coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
    isVerified: false,
    genres: ["Alternative", "Indie"],
    followersCount: 3200,
  },
];

const songs = [
  {
    title: "Midnight Drive",
    slug: "midnight-drive",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    coverUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400",
    duration: 372,
    genres: ["Electronic", "Synthwave"],
    streamCount: 45200,
    likesCount: 1820,
    artistSlug: "neon-pulse",
  },
  {
    title: "Neon City",
    slug: "neon-city",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    duration: 285,
    genres: ["Electronic", "Synthwave"],
    streamCount: 38100,
    likesCount: 1540,
    artistSlug: "neon-pulse",
  },
  {
    title: "Blue Hours",
    slug: "blue-hours",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    coverUrl: "https://images.unsplash.com/photo-1516575334481-f85287c2c82d?w=400",
    duration: 241,
    genres: ["Jazz", "Soul"],
    streamCount: 29800,
    likesCount: 1120,
    artistSlug: "luna-vox",
  },
  {
    title: "Golden Light",
    slug: "golden-light",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    coverUrl: "https://images.unsplash.com/photo-1516575334481-f85287c2c82d?w=400",
    duration: 198,
    genres: ["Soul", "R&B"],
    streamCount: 21400,
    likesCount: 890,
    artistSlug: "luna-vox",
  },
  {
    title: "Shadow Walk",
    slug: "shadow-walk",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400",
    duration: 312,
    genres: ["Alternative", "Indie"],
    streamCount: 15600,
    likesCount: 670,
    artistSlug: "darkwave",
  },
  {
    title: "Void Echo",
    slug: "void-echo",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400",
    duration: 267,
    genres: ["Alternative"],
    streamCount: 11200,
    likesCount: 445,
    artistSlug: "darkwave",
  },
  {
    title: "Pulse Wave",
    slug: "pulse-wave",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    coverUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400",
    duration: 334,
    genres: ["Electronic"],
    streamCount: 33500,
    likesCount: 1380,
    artistSlug: "neon-pulse",
  },
  {
    title: "Velvet Rain",
    slug: "velvet-rain",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    coverUrl: "https://images.unsplash.com/photo-1516575334481-f85287c2c82d?w=400",
    duration: 223,
    genres: ["Jazz", "R&B"],
    streamCount: 18700,
    likesCount: 760,
    artistSlug: "luna-vox",
  },
];

const albums = [
  {
    title: "Synthwave Dreams",
    slug: "synthwave-dreams",
    coverUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400",
    artistSlug: "neon-pulse",
    songSlugs: ["midnight-drive", "neon-city", "pulse-wave"],
  },
  {
    title: "Soul Sessions",
    slug: "soul-sessions",
    coverUrl: "https://images.unsplash.com/photo-1516575334481-f85287c2c82d?w=400",
    artistSlug: "luna-vox",
    songSlugs: ["blue-hours", "golden-light", "velvet-rain"],
  },
];

// ── Seed ─────────────────────────────────────────────────────────────────────

async function seed() {
  console.log("🌱 Connexion à MongoDB...");
  await mongoose.connect(MONGODB_URI);

  const UserModel  = mongoose.models.User  ?? mongoose.model("User",  UserSchema);
  const ArtistModel = mongoose.models.Artist ?? mongoose.model("Artist", ArtistSchema);
  const SongModel  = mongoose.models.Song  ?? mongoose.model("Song",  SongSchema);
  const AlbumModel = mongoose.models.Album ?? mongoose.model("Album", AlbumSchema);

  // Reset
  console.log("🗑  Nettoyage des collections...");
  await Promise.all([
    UserModel.deleteMany({}),
    ArtistModel.deleteMany({}),
    SongModel.deleteMany({}),
    AlbumModel.deleteMany({}),
  ]);

  // Users
  console.log("👤 Création des utilisateurs...");
  const password = await bcrypt.hash("password123", 12);

  const [adminUser, artistUser1, artistUser2, artistUser3, regularUser] =
    await UserModel.insertMany([
      {
        name: "Admin",
        email: "admin@moozik.com",
        password,
        role: "admin",
        isPremium: true,
        emailVerified: new Date(),
      },
      {
        name: "Neon Pulse",
        email: "neonpulse@moozik.com",
        password,
        role: "artist",
        isPremium: true,
        emailVerified: new Date(),
      },
      {
        name: "Luna Vox",
        email: "lunavox@moozik.com",
        password,
        role: "artist",
        isPremium: true,
        emailVerified: new Date(),
      },
      {
        name: "DarkWave",
        email: "darkwave@moozik.com",
        password,
        role: "artist",
        isPremium: false,
        emailVerified: new Date(),
      },
      {
        name: "Test User",
        email: "user@moozik.com",
        password,
        role: "user",
        isPremium: false,
        emailVerified: new Date(),
      },
    ]);

  // Artists
  console.log("🎤 Création des artistes...");
  const userMap: Record<string, any> = {
    "neon-pulse": artistUser1._id,
    "luna-vox": artistUser2._id,
    "darkwave": artistUser3._id,
  };

  const createdArtists = await ArtistModel.insertMany(
    artists.map((a) => ({ ...a, userId: userMap[a.slug] }))
  );

  const artistMap: Record<string, any> = {};
  createdArtists.forEach((a) => { artistMap[a.slug] = a._id; });

  // Songs
  console.log("🎵 Création des sons...");
  const createdSongs = await SongModel.insertMany(
    songs.map((s) => ({
      ...s,
      artist: artistMap[s.artistSlug],
      artistSlug: undefined,
    }))
  );

  const songMap: Record<string, any> = {};
  createdSongs.forEach((s) => { songMap[s.slug] = s._id; });

  // Albums
  console.log("💿 Création des albums...");
  await AlbumModel.insertMany(
    albums.map((a) => ({
      title: a.title,
      slug: a.slug,
      coverUrl: a.coverUrl,
      artist: artistMap[a.artistSlug],
      songs: a.songSlugs.map((slug) => songMap[slug]),
      releaseDate: new Date(),
    }))
  );

  console.log("\n✅ Seed terminé !\n");
  console.log("📋 Comptes de test :");
  console.log("   admin@moozik.com     / password123  (admin)");
  console.log("   neonpulse@moozik.com / password123  (artiste)");
  console.log("   lunavox@moozik.com   / password123  (artiste)");
  console.log("   user@moozik.com      / password123  (user)");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Erreur seed:", err);
  process.exit(1);
});