import { connectDB } from "@/lib/db";
import Song from "@/models/Song";
import { Header } from "@/components/layout/Header";
import { LibraryClient } from "./LibraryClient";

async function getSongs() {
  await connectDB();
  const songs = await Song.find()
    .populate("artist", "name")
    .sort({ createdAt: -1 })
    .lean();

  return songs.map((s) => ({
    id: s._id.toString(),
    title: s.title as string,
    artist: (s.artist as any)?.name ?? "—",
    streamCount: s.streamCount ?? 0,
    likesCount: s.likesCount ?? 0,
    isPublished: s.isPublished ?? true,
    createdAt: new Date(s.createdAt).toLocaleDateString("fr-FR"),
  }));
}

export default async function LibraryPage() {
  const songs = await getSongs();
  return (
    <div className="pb-32">
      <Header title="Bibliothèque" />
      <LibraryClient songs={songs} />
    </div>
  );
}