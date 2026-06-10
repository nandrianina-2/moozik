import { connectDB } from "@/lib/db";
import History from "@/models/History";
import Like from "@/models/Like";
import Song from "@/models/Song";
import Artist from "@/models/Artist";
import mongoose from "mongoose";

interface RecommendationContext {
  userId:    string;
  limit?:    number;
  exclude?:  string[]; // IDs à exclure
}

interface ScoredSong {
  songId: string;
  score:  number;
}

export async function getRecommendations({
  userId,
  limit = 20,
  exclude = [],
}: RecommendationContext) {
  await connectDB();

  const uid = new mongoose.Types.ObjectId(userId);

  // 1. Récupère l'historique des 50 dernières écoutes
  const history = await History.find({ user: uid })
    .populate("song", "genres artist duration")
    .sort({ playedAt: -1 })
    .limit(50)
    .lean();

  // 2. Récupère les likes
  const likes = await Like.find({ user: uid })
    .populate("song", "genres artist")
    .lean();

  // 3. Calcule les genres préférés avec pondération
  const genreScores: Record<string, number> = {};
  const artistScores: Record<string, number> = {};

  // Historique récent — poids décroissant
  history.forEach((h, i) => {
    const song = h.song as any;
    if (!song) return;
    const weight = 1 - (i / history.length) * 0.5; // 1.0 → 0.5

    song.genres?.forEach((g: string) => {
      genreScores[g] = (genreScores[g] ?? 0) + weight;
    });

    const artistId = song.artist?.toString();
    if (artistId) {
      artistScores[artistId] = (artistScores[artistId] ?? 0) + weight;
    }
  });

  // Likes — poids fort (×2)
  likes.forEach((l) => {
    const song = l.song as any;
    if (!song) return;

    song.genres?.forEach((g: string) => {
      genreScores[g] = (genreScores[g] ?? 0) + 2;
    });

    const artistId = song.artist?.toString();
    if (artistId) {
      artistScores[artistId] = (artistScores[artistId] ?? 0) + 2;
    }
  });

  // 4. Top genres et artistes
  const topGenres = Object.entries(genreScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([g]) => g);

  const topArtists = Object.entries(artistScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id]) => new mongoose.Types.ObjectId(id));

  // 5. IDs déjà écoutés récemment (à éviter)
  const recentlyPlayed = history
    .slice(0, 20)
    .map((h) => (h.song as any)?._id?.toString())
    .filter(Boolean);

  const excludeIds = [
    ...exclude,
    ...recentlyPlayed,
  ].map((id) => {
    try { return new mongoose.Types.ObjectId(id); }
    catch { return null; }
  }).filter(Boolean) as mongoose.Types.ObjectId[];

  // 6. Requête de recommandations — plusieurs stratégies
  const [
    byGenre,
    byArtist,
    trending,
    discovery,
  ] = await Promise.all([

    // Par genres préférés
    topGenres.length > 0
      ? Song.find({
          isPublished: true,
          genres:      { $in: topGenres },
          _id:         { $nin: excludeIds },
        })
          .populate("artist", "name slug image isVerified")
          .sort({ streamCount: -1 })
          .limit(Math.ceil(limit * 0.4))
          .lean()
      : [],

    // Par artistes préférés
    topArtists.length > 0
      ? Song.find({
          isPublished: true,
          artist:      { $in: topArtists },
          _id:         { $nin: excludeIds },
        })
          .populate("artist", "name slug image isVerified")
          .sort({ streamCount: -1 })
          .limit(Math.ceil(limit * 0.3))
          .lean()
      : [],

    // Tendances globales
    Song.find({
      isPublished: true,
      _id:         { $nin: excludeIds },
    })
      .populate("artist", "name slug image isVerified")
      .sort({ streamCount: -1 })
      .limit(Math.ceil(limit * 0.2))
      .lean(),

    // Découverte — sons récents peu connus
    Song.find({
      isPublished:  true,
      streamCount:  { $lt: 1000 },
      _id:          { $nin: excludeIds },
      releaseDate:  { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    })
      .populate("artist", "name slug image isVerified")
      .sort({ createdAt: -1 })
      .limit(Math.ceil(limit * 0.1))
      .lean(),
  ]);

  // 7. Fusion + déduplication + score final
  const seen   = new Set<string>();
  const scored: { song: any; score: number; reason: string }[] = [];

  function addSongs(
    songs: any[],
    baseScore: number,
    reason: string
  ) {
    songs.forEach((s) => {
      const id = s._id.toString();
      if (seen.has(id)) return;
      seen.add(id);

      // Score = base + bonus genres + bonus artiste + popularité
      let score = baseScore;

      s.genres?.forEach((g: string) => {
        score += (genreScores[g] ?? 0) * 0.3;
      });

      const artistId = s.artist?._id?.toString();
      if (artistId && artistScores[artistId]) {
        score += artistScores[artistId] * 0.5;
      }

      // Légère pondération popularité (normalisée)
      score += Math.log10((s.streamCount ?? 0) + 1) * 0.1;

      scored.push({ song: s, score, reason });
    });
  }

  addSongs(byArtist, 3.0, "artist");
  addSongs(byGenre,  2.0, "genre");
  addSongs(trending, 1.0, "trending");
  addSongs(discovery,0.5, "discovery");

  // 8. Tri par score + légère randomisation
  const result = scored
    .sort((a, b) => b.score - a.score + (Math.random() - 0.5) * 0.2)
    .slice(0, limit);

  return {
    songs: result.map(({ song, reason }) => ({
      id:          song._id.toString(),
      title:       song.title,
      slug:        song.slug,
      audioUrl:    song.audioUrl,
      coverUrl:    song.coverUrl,
      duration:    song.duration,
      genres:      song.genres ?? [],
      streamCount: song.streamCount ?? 0,
      likesCount:  song.likesCount ?? 0,
      isLiked:     false,
      releaseDate: new Date(song.releaseDate),
      reason,
      artist: {
        id:         song.artist._id.toString(),
        name:       song.artist.name ?? "",
        slug:       song.artist.slug ?? "",
        image:      song.artist.image,
        isVerified: song.artist.isVerified ?? false,
        userId:     "",
        followers:  0,
        genres:     [],
      },
    })),
    topGenres,
    hasHistory: history.length > 0,
  };
}

export async function getSimilarSongs(songId: string, limit = 10) {
  await connectDB();

  const song = await Song.findById(songId).lean();
  if (!song) return [];

  const similar = await Song.find({
    isPublished: true,
    _id:         { $ne: songId },
    $or: [
      { genres: { $in: song.genres as string[] } },
      { artist: song.artist },
    ],
  })
    .populate("artist", "name slug image isVerified")
    .sort({ streamCount: -1 })
    .limit(limit)
    .lean();

  return similar.map((s) => ({
    id:          s._id.toString(),
    title:       s.title,
    slug:        s.slug,
    audioUrl:    s.audioUrl,
    coverUrl:    s.coverUrl,
    duration:    s.duration,
    genres:      s.genres ?? [],
    streamCount: s.streamCount ?? 0,
    likesCount:  s.likesCount ?? 0,
    isLiked:     false,
    releaseDate: new Date(s.releaseDate as Date),
    artist: {
      id:         (s.artist as any)._id.toString(),
      name:       (s.artist as any).name ?? "",
      slug:       (s.artist as any).slug ?? "",
      image:      (s.artist as any).image,
      isVerified: (s.artist as any).isVerified ?? false,
      userId:     "",
      followers:  0,
      genres:     [],
    },
  }));
}