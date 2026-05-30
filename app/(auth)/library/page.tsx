import { Header } from "@/components/layout/Header";
import { connectDB } from "@/lib/db";
import Song from "@/models/Song";
import { SongRow } from "@/components/music/SongRow";
import type { Song as SongType, Artist as ArtistType } from "@/types";

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

async function getSongs() {
  await connectDB();
  const songs = await Song.find({ isPublished: true })
    .populate("artist", "name slug image isVerified")
    .sort({ releaseDate: -1 })
    .lean();
  return songs.map(toSong);
}

export default async function LibraryPage() {
  const songs = await getSongs();

  return (
    <div className="pb-32">
      <Header title="Bibliothèque" />
      <div className="px-4 md:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-white/40">{songs.length} sons</p>
        </div>
        <div className="flex flex-col gap-1">
          {songs.map((song, i) => (
            <SongRow
              key={song.id}
              song={song}
              queue={songs}
              index={i}
              showIndex
            />
          ))}
        </div>
      </div>
    </div>
  );
}