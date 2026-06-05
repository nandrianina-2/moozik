import { connectDB } from "@/lib/db";
import Artist from "@/models/Artist";
import { Header } from "@/components/layout/Header";
import { ArtistsGrid } from "./ArtistsGrid";
import type { Artist as ArtistType } from "@/types";

async function getArtists(): Promise<ArtistType[]> {
  await connectDB();
  const artists = await Artist.find()  // Pas de filtre restrictif
    .sort({ followersCount: -1, createdAt: -1 })
    .lean();
  return artists.map((a) => ({
    id:         (a._id as any).toString(),
    name:       a.name as string,
    slug:       a.slug as string ?? "",
    bio:        a.bio as string | undefined,
    image:      a.image as string | undefined,
    coverImage: a.coverImage as string | undefined,
    isVerified: a.isVerified as boolean ?? false,
    userId:     a.userId?.toString() ?? "",
    followers:  a.followersCount as number ?? 0,
    genres:     a.genres as string[] ?? [],
  }));
}

export const metadata = { title: "Artistes" };

export default async function ArtistsPage() {
  const artists = await getArtists();

  return (
    <div className="pb-32">
      <Header title="Artistes" />
      <div className="px-4 md:px-6 py-6">
        <p className="text-sm text-white/40 mb-6">
          {artists.length} artiste{artists.length > 1 ? "s" : ""}
        </p>
        <ArtistsGrid artists={artists} />
      </div>
    </div>
  );
}