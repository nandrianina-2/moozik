import { connectDB } from "@/lib/db";
import Artist from "@/models/Artist";
import Song from "@/models/Song";
import { Header } from "@/components/layout/Header";
import { SongRow } from "@/components/music/SongRow";
import { ArtistClient } from "./ArtistClient";
import type { Song as SongType, Artist as ArtistType } from "@/types";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

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
    genres: s.genres ?? [],
    streamCount: s.streamCount ?? 0,
    likesCount: s.likesCount ?? 0,
    isLiked: false,
    releaseDate: new Date(s.releaseDate),
  };
}

async function getData(id: string) {
  await connectDB();

  const [artist, songs] = await Promise.all([
    Artist.findById(id).lean(),
    Song.find({ artist: id, isPublished: true })
      .populate("artist", "name slug image isVerified")
      .sort({ streamCount: -1 })
      .lean(),
  ]);

  if (!artist) return null;

  return {
    artist: toArtist(artist),
    songs: songs.map(toSong),
  };
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const data = await getData(id);
  if (!data) return { title: "Artiste introuvable" };
  return {
    title: data.artist.name,
    description: data.artist.bio ?? `Écoute ${data.artist.name} sur Moozik`,
    openGraph: {
      images: data.artist.image ? [data.artist.image] : [],
    },
  };
}

export default async function ArtistPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await getData(id);
  if (!data) notFound();

  const { artist, songs } = data;

  return (
    <div className="pb-32">
      {/* Cover */}
      <div className="relative h-52 md:h-64 overflow-hidden">
        {artist.coverImage ? (
          <img
            src={artist.coverImage}
            alt={artist.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-900/60 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
      </div>

      <div className="px-4 md:px-6 -mt-16 relative">
        {/* Infos artiste */}
        <div className="flex items-end gap-4 mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#0a0a0a] bg-white/10 flex-shrink-0">
            {artist.image ? (
              <img
                src={artist.image}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white/20">
                {artist.name[0]}
              </div>
            )}
          </div>
          <div className="pb-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white truncate">
                {artist.name}
              </h1>
              {artist.isVerified && (
                <span className="text-purple-400 text-sm">✓</span>
              )}
            </div>
            <p className="text-sm text-white/40">
              {artist.followers.toLocaleString()} abonnés
            </p>
          </div>
        </div>

        {/* Actions */}
        <ArtistClient artist={artist} />

        {/* Bio */}
        {artist.bio && (
          <p className="text-sm text-white/50 mt-6 mb-8 leading-relaxed max-w-2xl">
            {artist.bio}
          </p>
        )}

        {/* Genres */}
        {artist.genres.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-8">
            {artist.genres.map((g) => (
              <span
                key={g}
                className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/50"
              >
                {g}
              </span>
            ))}
          </div>
        )}

        {/* Sons */}
        <h2 className="text-base font-semibold text-white mb-4">
          Sons ({songs.length})
        </h2>
        <div className="flex flex-col gap-1">
          {songs.map((song, i) => (
            <SongRow
              key={song.id}
              song={song}
              queue={songs}
              index={i}
              showIndex
              showArtist={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}