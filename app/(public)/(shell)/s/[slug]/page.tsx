import { connectDB } from "@/lib/db";
import Song from "@/models/Song";
import "@/models/Artist";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { SmartLinkClient } from "./SmartLinkClient";
import Image from "next/image";
import Link from "next/link";
import { formatDuration, formatCount } from "@/lib/utils";
import { Music2, Headphones, Heart, Calendar } from "lucide-react";
import type { Song as SongType, Artist as ArtistType } from "@/types";

async function getData(slug: string) {
  await connectDB();

  const song = await Song.findOne({ slug, isPublished: true })
    .populate("artist", "name slug image isVerified followersCount genres")
    .lean();

  if (!song) return null;

  const artist: ArtistType = {
    id:         (song.artist as any)._id.toString(),
    name:       (song.artist as any).name ?? "",
    slug:       (song.artist as any).slug ?? "",
    image:      (song.artist as any).image,
    isVerified: (song.artist as any).isVerified ?? false,
    followers:  (song.artist as any).followersCount ?? 0,
    userId:     "",
    genres:     (song.artist as any).genres ?? [],
  };

  const data: SongType = {
    id:          (song._id as any).toString(),
    title:       song.title as string,
    slug:        song.slug as string,
    audioUrl:    song.audioUrl as string,
    coverUrl:    song.coverUrl as string | undefined,
    duration:    song.duration as number,
    artist,
    genres:      (song.genres as string[]) ?? [],
    streamCount: song.streamCount as number ?? 0,
    likesCount:  song.likesCount as number ?? 0,
    isLiked:     false,
    lyrics:      song.lyrics as string | undefined,
    releaseDate: new Date(song.releaseDate as Date),
  };

  return data;
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const song = await getData(slug);
  if (!song) return { title: "Son introuvable" };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

  return {
    title:       `${song.title} — ${song.artist.name}`,
    description: `Écoute "${song.title}" par ${song.artist.name} sur Moozik`,
    openGraph: {
      title:       `${song.title} — ${song.artist.name}`,
      description: `${formatCount(song.streamCount)} écoutes · ${formatDuration(song.duration)}`,
      images:      song.coverUrl ? [{ url: song.coverUrl, width: 400, height: 400 }] : [],
      type:        "music.song",
    },
    twitter: {
      card:        "summary_large_image",
      title:       `${song.title} — ${song.artist.name}`,
      description: `Écoute sur Moozik`,
      images:      song.coverUrl ? [song.coverUrl] : [],
    },
  };
}

export default async function SmartLinkPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const song = await getData(slug);
  if (!song) notFound();

  return (
    <div className="pb-32">
      <Header title="Partage" />

      <div className="px-4 md:px-6 py-8 max-w-lg mx-auto">

        {/* Cover + infos */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative w-56 h-56 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 mb-5">
            {song.coverUrl ? (
              <Image
                src={song.coverUrl}
                alt={song.title}
                fill
                className="object-cover"
                unoptimized
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-900/60 to-black flex items-center justify-center">
                <Music2 size={48} className="text-white/20" />
              </div>
            )}
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">{song.title}</h1>

          <Link
            href={`/artists/${song.artist.id}`}
            className="flex items-center gap-2 mb-3 hover:opacity-80 transition-opacity"
          >
            {song.artist.image && (
              <div className="w-6 h-6 rounded-full overflow-hidden">
                <Image
                  src={song.artist.image}
                  alt={song.artist.name}
                  width={24}
                  height={24}
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
            <span className="text-sm text-white/60 hover:text-white transition-colors">
              {song.artist.name}
              {song.artist.isVerified && (
                <span className="text-purple-400 ml-1">✓</span>
              )}
            </span>
          </Link>

          {/* Genres */}
          {song.genres.length > 0 && (
            <div className="flex gap-2 flex-wrap justify-center mb-4">
              {song.genres.map((g) => (
                <span
                  key={g}
                  className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/50"
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-5 text-sm text-white/40">
            <span className="flex items-center gap-1.5">
              <Headphones size={14} className="text-purple-400" />
              {formatCount(song.streamCount)}
            </span>
            <span className="flex items-center gap-1.5">
              <Heart size={14} className="text-pink-400" />
              {formatCount(song.likesCount)}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {formatDuration(song.duration)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <SmartLinkClient song={song} />

        {/* Paroles */}
        {song.lyrics && (
          <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/5">
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
              Paroles
            </h2>
            <p className="text-sm text-white/60 leading-relaxed whitespace-pre-line">
              {song.lyrics}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}