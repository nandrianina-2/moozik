import { Header } from "@/components/layout/Header";
import { connectDB } from "@/lib/db";
import Song from "@/models/Song";
import Artist from "@/models/Artist";
import Like from "@/models/Like";
import { SongRow } from "@/components/music/SongRow";
import { Music2, Users, Radio, Heart } from "lucide-react";
import type { Song as SongType, Artist as ArtistType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { OnboardingWrapper } from "@/components/ui/OnboardingWrapper";
import { getAvatarUrl } from "@/lib/cloudinary";
import { getRecommendations } from "@/lib/recommendations";
import { cn } from "@/lib/utils";

function toArtist(a: any): ArtistType {
  return {
    id: a._id.toString(),
    name: a.name ?? "",
    slug: a.slug ?? "",
    bio: a.bio,
    image: a.image,
    coverImage: a.coverImage,
    isVerified: a.isVerified ?? false,
    userId: a.userId?.toString() ?? "",
    followers: a.followersCount ?? 0,
    genres: a.genres ?? [],
  };
}

function toSong(s: any): SongType {
  return {
    id: s._id.toString(),
    title: s.title ?? "",
    slug: s.slug ?? "",
    audioUrl: s.audioUrl ?? "",
    coverUrl: s.coverUrl,
    duration: s.duration ?? 0,
    artist: toArtist(s.artist),
    albumId: s.album?.toString(),
    genres: s.genres ?? [],
    streamCount: s.streamCount ?? 0,
    likesCount: s.likesCount ?? 0,
    isLiked: false,
    lyrics: s.lyrics,
    releaseDate: new Date(s.releaseDate),
  };
}

async function getData() {
  await connectDB();

  const session = await auth();

  const recommendations = session?.user?.id
    ? await getRecommendations({ userId: session.user.id, limit: 8 })
    : { songs: [], topGenres: [], hasHistory: false };

  const [
    recentSongs,
    popularSongs,
    artists,
    totalSongs,
    totalArtists,
    userLikes,
  ] = await Promise.all([
    Song.find({ isPublished: true })
      .populate("artist", "name slug image isVerified")
      .sort({ releaseDate: -1 })
      .limit(8)
      .lean(),
    Song.find({
        isPublished: true,
        $or: [
          { scheduledAt: { $exists: false } },
          { scheduledAt: { $lte: new Date() } },
        ],
      })
      .populate("artist", "name slug image isVerified")
      .sort({ streamCount: -1 })
      .limit(8)
      .lean(),
    Artist.find()
      .sort({ followersCount: -1 })
      .limit(6)
      .lean(),
    Song.countDocuments({ isPublished: true }),
    Artist.countDocuments(),
    session
      ? Like.countDocuments({ user: session.user.id })
      : Promise.resolve(0),
  ]);

  return {
    recentSongs,
    popularSongs,
    artists,
    totalSongs,
    totalArtists,
    userLikes,
    recommendations,
  };
}

export const metadata = {
  title: "Accueil",
};

export default async function DashboardPage() {
  const {
    recentSongs,
    popularSongs,
    artists,
    totalSongs,
    totalArtists,
    userLikes,
    recommendations,
  } = await getData();

  const songs = recentSongs.map(toSong);
  const popular = popularSongs.map(toSong);
  const artistList = artists.map(toArtist);

  return (
    <>
      <OnboardingWrapper />
      <div className="pb-32">
        <Header title="Accueil" />

        <div className="px-4 md:px-6 py-6 space-y-10">

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Music2, label: "Sons",     value: totalSongs,    href: "/library" },
              { icon: Users,  label: "Artistes", value: totalArtists,  href: "/artists" },
              { icon: Radio,  label: "Radio",    value: "∞",           href: "/radio" },
              { icon: Heart,  label: "Favoris",  value: userLikes,     href: "/favorites" },
            ].map(({ icon: Icon, label, value, href }) => (
              <Link
                key={label}
                href={href}
                className="bg-white/5 rounded-xl p-4 border border-white/5 hover:bg-white/8 hover:border-purple-500/20 transition-all group"
              >
                <Icon size={18} className="text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-xl font-bold text-white">{value}</p>
                <p className="text-xs text-white/40 mt-0.5">{label}</p>
              </Link>
            ))}
          </div>

          {/* Artistes */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white">Artistes</h2>
              <Link
                href="/artists"
                className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                Voir tout
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {artistList.map((artist) => (
                <Link
                  key={artist.id}
                  href={`/artists/${artist.id}`}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-white/10 flex-shrink-0">
                    {artist.image ? (
                      <Image
                        src={getAvatarUrl(artist.image, 64)}
                        alt={artist.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/10 flex items-center justify-center text-white/20 text-xl font-bold">
                        {artist.name[0]}
                      </div>
                    )}
                  </div>
                  <div className="text-center min-w-0 w-full">
                    <p className="text-xs font-medium text-white truncate">
                      {artist.name}
                    </p>
                    {artist.isVerified && (
                      <p className="text-[10px] text-purple-400">✓ Vérifié</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Populaires */}
          <section>
            <h2 className="text-base font-semibold text-white mb-4">
              Populaires en ce moment
            </h2>
            <div className="flex flex-col gap-1">
              {popular.map((song, i) => (
                <SongRow
                  key={song.id}
                  song={song}
                  queue={popular}
                  index={i}
                  showIndex
                />
              ))}
            </div>
          </section>

          {/* Nouveautés */}
          <section>
            <h2 className="text-base font-semibold text-white mb-4">
              Nouveautés
            </h2>
            <div className="flex flex-col gap-1">
              {songs.map((song, i) => (
                <SongRow
                  key={song.id}
                  song={song}
                  queue={songs}
                  index={i}
                  showIndex={false}
                />
              ))}
            </div>
          </section>

          {recommendations.songs.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-semibold text-white">
                    {recommendations.hasHistory
                      ? "Recommandés pour toi"
                      : "À découvrir"}
                  </h2>
                  {recommendations.topGenres.length > 0 && (
                    <p className="text-xs text-white/30 mt-0.5">
                      Basé sur tes goûts · {recommendations.topGenres.slice(0, 3).join(", ")}
                    </p>
                  )}
                </div>
                <Link
                  href="/discover"
                  className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Voir plus
                </Link>
              </div>
              <div className="flex flex-col gap-1">
                {recommendations.songs.map((song, i) => (
                  <div key={song.id} className="relative">
                    <SongRow
                      song={song}
                      queue={recommendations.songs}
                      index={i}
                      showIndex={false}
                    />
                    {/* Badge raison */}
                    <span className={cn(
                      "absolute right-16 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5 rounded-full hidden md:block",
                      song.reason === "artist"    && "bg-purple-500/20 text-purple-400",
                      song.reason === "genre"     && "bg-blue-500/20 text-blue-400",
                      song.reason === "trending"  && "bg-orange-500/20 text-orange-400",
                      song.reason === "discovery" && "bg-green-500/20 text-green-400",
                    )}>
                      {song.reason === "artist"    && "Artiste suivi"}
                      {song.reason === "genre"     && "Ton genre"}
                      {song.reason === "trending"  && "Tendance"}
                      {song.reason === "discovery" && "Découverte"}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}