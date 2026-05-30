import { Header } from "@/components/layout/Header";
import { SearchClient } from "./SearchClient";
import { connectDB } from "@/lib/db";
import Song from "@/models/Song";
import Artist from "@/models/Artist";
import type { Song as SongType, Artist as ArtistType } from "@/types";

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

async function getData() {
  await connectDB();
  const [songs, artists] = await Promise.all([
    Song.find({ isPublished: true })
      .populate("artist", "name slug image isVerified")
      .sort({ streamCount: -1 })
      .limit(20)
      .lean(),
    Artist.find().sort({ followersCount: -1 }).limit(12).lean(),
  ]);
  return {
    songs: songs.map(toSong),
    artists: artists.map(toArtist),
  };
}

export default async function SearchPage() {
  const { songs, artists } = await getData();

  return (
    <div className="pb-32">
      <Header title="Recherche" />
      <div className="px-4 md:px-6 py-6">
        <SearchClient initialSongs={songs} initialArtists={artists} />
      </div>
    </div>
  );
}