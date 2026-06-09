import { Header } from "@/components/layout/Header";
import { RadioClient } from "./RadioClient";
import { connectDB } from "@/lib/db";
import Song from "@/models/Song";
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

async function getRadioSongs() {
  await connectDB();
  const songs = await Song.find({ isPublished: true })
    .populate("artist", "name slug image isVerified")
    .lean();
  // Mélange aléatoire
  return songs.map(toSong).sort(() => Math.random() - 0.5);
}

export const metadata = { title: "Radio" };

export default async function RadioPage() {
  const songs = await getRadioSongs();

  return (
    <div className="pb-32">
      <Header title="Radio" />
      <RadioClient songs={songs} />
    </div>
  );
}