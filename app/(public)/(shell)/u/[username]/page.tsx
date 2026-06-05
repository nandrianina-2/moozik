import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Artist from "@/models/Artist";
import Playlist from "@/models/Playlist";
import Like from "@/models/Like";
import Song from "@/models/Song";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import {
  Crown, ListMusic, Heart, Calendar,
  Shield, Mic2, Instagram, Twitter,
  Globe, Users, Music2, BadgeCheck,
} from "lucide-react";
import Link from "next/link";
import { formatCount } from "@/lib/utils";
import type { Song as SongType, Artist as ArtistType } from "@/types";
import { SongRow } from "@/components/music/SongRow";
import Image from "next/image";

function toArtistType(a: any): ArtistType {
  return {
    id:         a._id.toString(),
    name:       a.name ?? "",
    slug:       a.slug ?? "",
    bio:        a.bio,
    image:      a.image,
    coverImage: a.coverImage,
    isVerified: a.isVerified ?? false,
    userId:     a.userId?.toString() ?? "",
    followers:  a.followersCount ?? 0,
    genres:     a.genres ?? [],
  };
}

function toSongType(s: any, artist: ArtistType): SongType {
  return {
    id:          s._id.toString(),
    title:       s.title ?? "",
    slug:        s.slug ?? "",
    audioUrl:    s.audioUrl ?? "",
    coverUrl:    s.coverUrl,
    duration:    s.duration ?? 0,
    artist,
    genres:      s.genres ?? [],
    streamCount: s.streamCount ?? 0,
    likesCount:  s.likesCount ?? 0,
    isLiked:     false,
    releaseDate: new Date(s.releaseDate),
  };
}

function Avatar({
  src,
  alt,
  size = 96,
  className = "",
}: {
  src?: string | null;
  alt: string;
  size?: number;
  className?: string;
}) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-purple-600/20 text-purple-400 font-bold ${className}`}
        style={{ fontSize: size / 3 }}
      >
        {alt[0]?.toUpperCase()}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`object-cover ${className}`}
      unoptimized
    />
  );
}

async function getData(username: string) {
  await connectDB();

  const user = await User.findOne({ username }).lean();
  if (!user) return null;

  // Données artiste si applicable
  let artistData = null;
  let topSongs: SongType[] = [];

  if (user.role === "artist" || user.role === "admin") {
    artistData = await Artist.findOne({ userId: user._id }).lean();

    if (artistData) {
      const songs = await Song.find({
        artist: artistData._id,
        isPublished: true,
      })
        .sort({ streamCount: -1 })
        .limit(5)
        .lean();

      const artist = toArtistType(artistData);
      topSongs = songs.map((s) => toSongType(s, artist));
    }
  }

  const [playlists, likesCount] = await Promise.all([
    Playlist.find({ user: user._id, isPublic: true })
      .sort({ createdAt: -1 })
      .limit(12)
      .lean(),
    Like.countDocuments({ user: user._id }),
  ]);

  // Fusion données User + Artist
  const profile = {
    id:         (user._id as any).toString(),
    name:       artistData?.name ?? (user.name as string),
    username:   (user as any).username as string,
    image:      artistData?.image ?? (user as any).image,
    coverImage: artistData?.coverImage ?? (user as any).coverImage,
    bio:        artistData?.bio ?? (user as any).bio,
    isPremium:  user.isPremium as boolean,
    role:       user.role as string,
    createdAt:  new Date(user.createdAt),
    likesCount,
    socialLinks: (artistData as any)?.socialLinks ?? (user as any)?.socialLinks ?? {},
    // Données artiste
    isVerified:     artistData?.isVerified ?? false,
    followersCount: artistData?.followersCount ?? 0,
    genres:         (artistData?.genres as string[]) ?? [],
    totalSongs:     topSongs.length,
  };

  return {
    profile,
    playlists: playlists.map((p) => ({
      id:          (p._id as any).toString(),
      name:        p.name as string,
      description: p.description as string | undefined,
      songsCount:  (p.songs as any[]).length,
    })),
    topSongs,
    artistId: artistData ? (artistData._id as any).toString() : null,
  };
}

export async function generateMetadata(
  { params }: { params: Promise<{ username: string }> }
): Promise<Metadata> {
  const { username } = await params;
  const data = await getData(username);
  if (!data) return { title: "Profil introuvable" };
  return {
    title: `${data.profile.name} (@${data.profile.username})`,
    description: data.profile.bio ?? `Profil de ${data.profile.name} sur Moozik`,
    openGraph: {
      images: data.profile.image ? [data.profile.image] : [],
    },
  };
}

export default async function UserProfilePage(
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const data = await getData(username);
  if (!data) notFound();

  const { profile, playlists, topSongs, artistId } = data;
  const isArtist = profile.role === "artist" || profile.role === "admin";

  return (
    <div className="pb-32">
      <Header title="Profil" />

      {/* Cover */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        {profile.coverImage ? (
          <Image
            src={profile.coverImage}
            alt="Cover"
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-900/60 via-purple-800/30 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      <div className="px-4 md:px-6 -mt-16 relative max-w-3xl">

        {/* Avatar + infos */}
        <div className="flex items-end gap-4 mb-4">
          <div className="w-24 h-24 rounded-full border-4 border-[#0a0a0a] bg-purple-600/20 overflow-hidden flex-shrink-0 shadow-xl">
            {profile.image ? (
              <Avatar
                src={profile.image}
                alt={profile.name}
                size={96}
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-purple-400">
                {profile.name[0]?.toUpperCase()}
              </div>
            )}
          </div>

          <div className="pb-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-white truncate">
                {profile.name}
              </h1>
              {profile.isVerified && (
                <BadgeCheck size={20} className="text-purple-400 flex-shrink-0" />
              )}
              {profile.isPremium && (
                <span className="flex items-center gap-1 text-xs bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-500/20">
                  <Crown size={11} /> Premium
                </span>
              )}
              {profile.role === "admin" && (
                <span className="flex items-center gap-1 text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full">
                  <Shield size={11} /> Admin
                </span>
              )}
            </div>
            <p className="text-sm text-white/40 mt-0.5">@{profile.username}</p>
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-sm text-white/60 leading-relaxed mb-4 max-w-xl">
            {profile.bio}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-5 mb-4 flex-wrap">
          {isArtist && (
            <div className="flex items-center gap-1.5 text-sm">
              <Users size={14} className="text-purple-400" />
              <span className="font-semibold text-white">
                {formatCount(profile.followersCount)}
              </span>
              <span className="text-white/40">abonnés</span>
            </div>
          )}
          {isArtist && (
            <div className="flex items-center gap-1.5 text-sm">
              <Music2 size={14} className="text-purple-400" />
              <span className="font-semibold text-white">{topSongs.length}</span>
              <span className="text-white/40">sons</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-sm">
            <Heart size={14} className="text-pink-400" />
            <span className="font-semibold text-white">
              {formatCount(profile.likesCount)}
            </span>
            <span className="text-white/40">likes</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <ListMusic size={14} className="text-purple-400" />
            <span className="font-semibold text-white">{playlists.length}</span>
            <span className="text-white/40">playlists</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-white/30">
            <Calendar size={13} />
            Depuis {profile.createdAt.toLocaleDateString("fr-FR", {
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>

        {/* Genres artiste */}
        {isArtist && profile.genres.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-4">
            {profile.genres.map((g) => (
              <span
                key={g}
                className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/50"
              >
                {g}
              </span>
            ))}
          </div>
        )}

        {/* Liens sociaux */}
        {(profile.socialLinks?.instagram || profile.socialLinks?.twitter || profile.socialLinks?.website) && (
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            {profile.socialLinks?.instagram && (
              <a 
                href={profile.socialLinks.instagram.startsWith("http")
                  ? profile.socialLinks.instagram
                  : `https://${profile.socialLinks.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                <Instagram size={14} /> Instagram
              </a>
            )}
            {profile.socialLinks?.twitter && (
              <a 
                href={profile.socialLinks.twitter.startsWith("http")
                  ? profile.socialLinks.twitter
                  : `https://${profile.socialLinks.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                <Twitter size={14} /> Twitter
              </a>
            )}
            {profile.socialLinks?.website && (
              <a 
                href={profile.socialLinks.website.startsWith("http")
                  ? profile.socialLinks.website
                  : `https://${profile.socialLinks.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                <Globe size={14} /> Site web
              </a>
            )}
          </div>
        )}

        {/* Bouton vers page artiste */}
        {isArtist && artistId && (
          <div className="mb-8">
            <Link
              href={`/artists/${artistId}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors"
            >
              <Mic2 size={15} />
              Voir tous ses sons
            </Link>
          </div>
        )}

        {/* Top sons artiste */}
        {isArtist && topSongs.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">
              Sons populaires
            </h2>
            <div className="flex flex-col gap-1">
              {topSongs.map((song, i) => (
                <SongRow
                  key={song.id}
                  song={song}
                  queue={topSongs}
                  index={i}
                  showIndex
                  showArtist={false}
                />
              ))}
            </div>
          </section>
        )}

        {/* Playlists publiques */}
        {playlists.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">
              Playlists publiques
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {playlists.map((playlist) => (
                <Link
                  key={playlist.id}
                  href={`/playlists/${playlist.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/8 hover:border-purple-500/20 transition-all group"
                >
                  <div className="w-12 h-12 rounded-lg bg-purple-600/20 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600/30 transition-colors">
                    <ListMusic size={20} className="text-purple-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {playlist.name}
                    </p>
                    {playlist.description && (
                      <p className="text-xs text-white/40 truncate mt-0.5">
                        {playlist.description}
                      </p>
                    )}
                    <p className="text-xs text-white/30 mt-0.5">
                      {playlist.songsCount} son{playlist.songsCount > 1 ? "s" : ""}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Vide */}
        {playlists.length === 0 && topSongs.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center">
              <ListMusic size={24} className="text-white/20" />
            </div>
            <p className="text-white/30 text-sm">
              Aucun contenu public pour l'instant
            </p>
          </div>
        )}

      </div>
    </div>
  );
}