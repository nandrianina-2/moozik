import { Header } from "@/components/layout/Header";
import { EditSongForm } from "./EditSongForm";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Song from "@/models/Song";
import Artist from "@/models/Artist";
import { notFound } from "next/navigation";

async function getSong(id: string, userId: string) {
  await connectDB();
  const artist = await Artist.findOne({ userId });
  if (!artist) return null;

  const song = await Song.findOne({ _id: id, artist: artist._id }).lean();
  if (!song) return null;

  return {
    id: (song._id as any).toString(),
    title: song.title as string,
    coverUrl: song.coverUrl as string | undefined,
    genres: (song.genres as string[]) ?? [],
    lyrics: song.lyrics as string | undefined,
    isPublished: song.isPublished as boolean,
    releaseDate: song.releaseDate
      ? new Date(song.releaseDate).toISOString().split("T")[0]
      : "",
    scheduledAt: song.scheduledAt
      ? new Date(song.scheduledAt).toISOString().slice(0, 16)
      : "",
  };
}

export default async function EditSongPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const song = await getSong(id, session!.user.id);

  if (!song) notFound();

  return (
    <div className="pb-32">
      <Header title="Modifier le son" />
      <EditSongForm song={song} />
    </div>
  );
}