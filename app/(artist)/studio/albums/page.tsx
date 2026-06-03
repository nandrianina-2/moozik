import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Artist from "@/models/Artist";
import Album from "@/models/Album";
import Song from "@/models/Song";
import { Header } from "@/components/layout/Header";
import { AlbumsClient } from "./AlbumsClient";

async function getData(userId: string) {
  await connectDB();
  const artist = await Artist.findOne({ userId }).lean();
  if (!artist) return null;

  const [albums, songs] = await Promise.all([
    Album.find({ artist: artist._id })
      .sort({ releaseDate: -1 })
      .lean(),
    Song.find({ artist: artist._id, isPublished: true })
      .select("_id title duration coverUrl")
      .sort({ releaseDate: -1 })
      .lean(),
  ]);

  return {
    artistId: (artist._id as any).toString(),
    albums: albums.map((a) => ({
      id:          (a._id as any).toString(),
      title:       a.title as string,
      coverUrl:    a.coverUrl as string | undefined,
      songsCount:  (a.songs as any[]).length,
      releaseDate: new Date(a.releaseDate).toLocaleDateString("fr-FR"),
      isPublished: a.isPublished as boolean,
    })),
    songs: songs.map((s) => ({
      id:       (s._id as any).toString(),
      title:    s.title as string,
      duration: s.duration as number,
      coverUrl: s.coverUrl as string | undefined,
    })),
  };
}

export default async function AlbumsPage() {
  const session = await auth();
  const data = await getData(session!.user.id);

  if (!data) {
    return (
      <div className="pb-32">
        <Header title="Mes albums" />
        <div className="px-4 md:px-6 py-20 text-center">
          <p className="text-white/40 text-sm">Profil artiste introuvable.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32">
      <Header title="Mes albums" />
      <AlbumsClient
        albums={data.albums}
        songs={data.songs}
        artistId={data.artistId}
      />
    </div>
  );
}