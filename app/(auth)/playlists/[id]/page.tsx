import { connectDB } from "@/lib/db";
import Playlist from "@/models/Playlist";
import User from "@/models/User";
import { auth } from "@/lib/auth";
import "@/models/Song";
import "@/models/Artist";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { PlaylistPageClient } from "./PlaylistPageClient";
import type { Song as SongType, Artist as ArtistType } from "@/types";
import { formatDuration } from "@/lib/utils";
import { Lock } from "lucide-react";

function toArtist(a: any): ArtistType {
  return {
    id:         a._id.toString(),
    name:       a.name ?? "",
    slug:       a.slug ?? "",
    image:      a.image,
    isVerified: a.isVerified ?? false,
    userId:     a.userId?.toString() ?? "",
    followers:  a.followersCount ?? 0,
    genres:     a.genres ?? [],
  };
}

function toSong(s: any): SongType {
  return {
    id:          s._id.toString(),
    title:       s.title ?? "",
    slug:        s.slug ?? "",
    audioUrl:    s.audioUrl ?? "",
    coverUrl:    s.coverUrl,
    duration:    s.duration ?? 0,
    artist:      toArtist(s.artist),
    genres:      s.genres ?? [],
    streamCount: s.streamCount ?? 0,
    likesCount:  s.likesCount ?? 0,
    isLiked:     false,
    releaseDate: new Date(s.releaseDate),
  };
}

async function getData(id: string) {
  await connectDB();

  const playlist = await Playlist.findById(id)
    .populate({
      path: "songs",
      populate: { path: "artist", select: "name slug image isVerified followersCount" },
    })
    .lean();

  if (!playlist) return null;

  const owner = await User.findById(playlist.user)
    .select("name username image")
    .lean();

  const songs = (playlist.songs as any[])
    .filter((s) => s?.artist)
    .map(toSong);

  const totalDuration = songs.reduce((acc, s) => acc + s.duration, 0);

  return {
    playlist: {
      id:          (playlist._id as any).toString(),
      name:        playlist.name as string,
      description: playlist.description as string | undefined,
      isPublic:    playlist.isPublic as boolean,
      coverUrl:    playlist.coverUrl as string | undefined,
      userId:      (playlist.user as any).toString(),
      createdAt:   new Date(playlist.createdAt),
    },
    songs,
    totalDuration,
    owner: owner ? {
      id:       (owner._id as any).toString(),
      name:     owner.name as string,
      username: (owner as any).username as string | undefined,
      image:    owner.image as string | undefined,
    } : null,
  };
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const data = await getData(id);
  if (!data || !data.playlist.isPublic) return { title: "Playlist" };
  return {
    title: data.playlist.name,
    description: data.playlist.description ??
      `${data.songs.length} sons · par ${data.owner?.name}`,
    openGraph: {
      images: data.playlist.coverUrl ? [data.playlist.coverUrl] : [],
    },
  };
}

export default async function PlaylistPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  const data = await getData(id);

  if (!data) notFound();

  const { playlist, songs, totalDuration, owner } = data;

  const isOwner = session?.user?.id === playlist.userId;
  const canAccess = playlist.isPublic || isOwner || session?.user?.role === "admin";

  // Playlist privée et pas le propriétaire
  if (!canAccess) {
    return (
      <div className="pb-32">
        <Header title="Playlist" />
        <div className="flex flex-col items-center gap-4 py-20 text-center px-6">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
            <Lock size={28} className="text-white/20" />
          </div>
          <div>
            <p className="text-white/60 text-base font-semibold">
              Playlist privée
            </p>
            <p className="text-white/30 text-sm mt-1">
              Tu n'as pas accès à cette playlist
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32">
      <Header title="Playlist" />

      <div className="px-4 md:px-6 py-6 max-w-3xl">

        {/* Header playlist */}
        <div className="flex gap-5 items-end mb-6">
          <div className="w-36 h-36 md:w-44 md:h-44 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900/60 to-purple-600/20 flex-shrink-0 shadow-2xl">
            {playlist.coverUrl ? (
              <img
                src={playlist.coverUrl}
                alt={playlist.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl">
                🎵
              </div>
            )}
          </div>

          <div className="min-w-0 pb-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs text-white/40 uppercase tracking-wider">
                {playlist.isPublic ? "Playlist publique" : "Playlist privée"}
              </p>
              {!playlist.isPublic && (
                <Lock size={11} className="text-white/30" />
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-white truncate leading-tight mb-1">
              {playlist.name}
            </h1>

            {playlist.description && (
              <p className="text-sm text-white/50 mb-2 line-clamp-2">
                {playlist.description}
              </p>
            )}

            {owner && (
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-purple-600/30 overflow-hidden flex-shrink-0">
                  {owner.image ? (
                    <img src={owner.image} alt={owner.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-purple-400">
                      {owner.name[0]}
                    </div>
                  )}
                </div>
                {owner.username ? (
                  <a 
                    href={`/u/${owner.username}`}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {owner.name}
                  </a>
                ) : (
                  <span className="text-sm text-white/60">{owner.name}</span>
                )}
              </div>
            )}

            <p className="text-xs text-white/30">
              {songs.length} son{songs.length > 1 ? "s" : ""}
              {totalDuration > 0 && ` · ${formatDuration(totalDuration)}`}
              {" · "}
              {playlist.createdAt.toLocaleDateString("fr-FR", {
                day: "numeric", month: "long", year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Actions + liste */}
        <PlaylistPageClient
          songs={songs}
          playlistId={playlist.id}
          playlistName={playlist.name}
          isPublic={playlist.isPublic}
          isOwner={isOwner}
        />

      </div>
    </div>
  );
}