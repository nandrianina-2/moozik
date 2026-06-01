import { connectDB } from "@/lib/db";
import Artist from "@/models/Artist";
import { Header } from "@/components/layout/Header";
import { ArtistsAdminClient } from "./ArtistsAdminClient";

async function getArtists() {
  await connectDB();
  const artists = await Artist.find()
    .populate("userId", "email")
    .sort({ createdAt: -1 })
    .lean();

  return artists.map((a) => ({
    id: a._id.toString(),
    name: a.name as string,
    slug: a.slug as string,
    email: (a.userId as any)?.email ?? "—",
    isVerified: a.isVerified ?? false,
    followersCount: a.followersCount ?? 0,
    genres: (a.genres as string[]) ?? [],
  }));
}

export default async function ArtistsAdminPage() {
  const artists = await getArtists();
  return (
    <div className="pb-32">
      <Header title="Artistes" />
      <ArtistsAdminClient artists={artists} />
    </div>
  );
}