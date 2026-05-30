import { connectDB } from "@/lib/db";
import Album from "@/models/Album";
import { SongRow } from "@/components/music/SongRow";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Song as SongType, Artist as ArtistType } from "@/types";
import { formatDuration } from "@/lib/utils";
import { AlbumClient } from "./AlbumClient";

function toArtist(a: any): ArtistType {
  return {
    id: a._id.toString(),
    name: a.name ?? "",
    slug: a.slug ?? "",
    image: a.image,
    isVerified: a.isVerified ?? false,
    userId: a.userId?.toString() ?? "",
    followers: a.followersCount ?? 0,
    genres: a.genres ?? [],
  };
}

function toSong(s: any, artist: ArtistType): SongType {
  return {
    id: s._id.toString(),
    title: s.title ?? "",
    slug: s.slug ?? "",
    audioUrl: s.audioUrl ?? "",
    coverUrl: s.coverUrl,
    duration: s.duration ?? 0,
    artist,
    genres: s.genres ?? [],
    streamCount: s.streamCount ?? 0,
    likesCount: s.likesCount ?? 0,
    isLiked: false,
    releaseDate: new Date(s.releaseDate),
  };
}

async function getData(id: string) {
  await connectDB();
  const album = await Album.findById(id)
    .populate("artist", "name slug image isVerified followersCount")
    .populate("songs")
    .lean();
  if (!album) return null;

  const artist = toArtist(album.artist as any);
  const songs = (album.songs as any[]).map((s) => toSong(s, artist));
  const totalDuration = songs.reduce((acc, s) => acc + s.duration, 0);

  return {
    id: (album._id as any).toString(),
    title: album.title,
    coverUrl: album.coverUrl,
    releaseDate: new Date(album.releaseDate),
    artist,
    songs,
    totalDuration,
  };
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const data = await getData(id);
  if (!data) return { title: "Album introuvable" };
  return {
    title: `${data.title} — ${data.artist.name}`,
    openGraph: { images: data.coverUrl ? [data.coverUrl] : [] },
  };
}

export default async function AlbumPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await getData(id);
  if (!data) notFound();

  return (
    <div className="pb-32">
      {/* Header album */}
      <div className="px-4 md:px-6 pt-8 pb-6">
        <div className="flex gap-5 items-end">
          <div className="w-36 h-36 md:w-44 md:h-44 rounded-xl overflow-hidden bg-white/5 flex-shrink-0 shadow-2xl">
            {data.coverUrl ? (
              <img
                src={data.coverUrl}
                alt={data.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-white/10" />
            )}
          </div>
          <div className="min-w-0 pb-1">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">
              Album
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 truncate">
              {data.title}
            </h1>
            <p className="text-sm text-white/60">{data.artist.name}</p>
            <p className="text-xs text-white/30 mt-1">
              {data.songs.length} sons ·{" "}
              {formatDuration(data.totalDuration)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5">
          <AlbumClient songs={data.songs} />
        </div>
      </div>

      {/* Liste des sons */}
      <div className="px-4 md:px-6">
        <div className="flex flex-col gap-1">
          {data.songs.map((song, i) => (
            <SongRow
              key={song.id}
              song={song}
              queue={data.songs}
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