import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Song from "@/models/Song";
import Artist from "@/models/Artist";
import User from "@/models/User";
import Like from "@/models/Like";
import { Header } from "@/components/layout/Header";
import {
  Music2, TrendingUp, Heart,
  Upload, BarChart2, Disc3, Pencil 
} from "lucide-react";
import Link from "next/link";
import { formatCount } from "@/lib/utils";
import { SongsList } from "./SongsList";

async function getStudioData(userId: string) {
  await connectDB();

  let artist = await Artist.findOne({ userId }).lean();
  if (!artist) {
    const user = await User.findById(userId).select("name image").lean();
    if (!user) return null;

    const {slugify} = await import("@/lib/utils");
    let slug = slugify(user.name as string);
    const existing = await Artist.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;

    artist = (await Artist.create({
      name:           user.name,
      slug,
      userId,         
      isVerified:     false,
      followersCount: 0,
      genres:         [],
      image:          (user as any).image,
    })) as any as typeof artist;
  }

  if(!artist) return null;

  const artistId = (artist._id as any).toString();

  const [songs, totalStreams, totalLikes] = await Promise.all([
    Song.find({ artist: artistId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
    Song.aggregate([
      { $match: { artist: artist._id } },
      { $group: { _id: null, total: { $sum: "$streamCount" } } },
    ]),
    Like.countDocuments({
      song: { $in: await Song.find({ artist: artistId }).distinct("_id") },
    }),
  ]);

  return {
    artist: {
      id: artistId,
      name: artist.name as string,
      isVerified: artist.isVerified as boolean,
      followersCount: artist.followersCount as number,
    },
    songs: songs.map((s) => ({
      id: (s._id as any).toString(),
      title: s.title as string,
      streamCount: s.streamCount ?? 0,
      likesCount: s.likesCount ?? 0,
      isPublished: s.isPublished ?? true,
      createdAt: new Date(s.createdAt).toLocaleDateString("fr-FR"),
    })),
    totalStreams: totalStreams[0]?.total ?? 0,
    totalLikes,
    totalSongs: songs.length,
  };
}

export const metadata = { title: "Mon studio" };

export default async function StudioPage() {
  const session = await auth();
  const data = await getStudioData(session!.user.id);

  if (!data) {
    return (
      <div className="pb-32">
        <Header title="Mon Studio" />
        <div className="px-4 md:px-6 py-20 text-center">
          <p className="text-white/40 text-sm">
            Profil artiste introuvable. Contacte un admin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32">
      <Header title="Mon Studio" />

      <div className="px-4 md:px-6 py-6 space-y-8">

        {/* Artiste info */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
          <div className="w-14 h-14 rounded-full bg-purple-600/30 flex items-center justify-center text-2xl font-bold text-purple-400 flex-shrink-0">
            {data.artist.name[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">{data.artist.name}</h2>
              {data.artist.isVerified && (
                <span className="text-xs text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded-full">
                  ✓ Vérifié
                </span>
              )}
            </div>
            <p className="text-sm text-white/40">
              {formatCount(data.artist.followersCount)} abonnés
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { icon: Music2,     label: "Sons",    value: data.totalSongs,   href: "/studio" },
            { icon: TrendingUp, label: "Streams", value: formatCount(data.totalStreams), href: "/studio/analytics" },
            { icon: Heart,      label: "Likes",   value: formatCount(data.totalLikes),  href: "/studio/analytics" },
          ].map(({ icon: Icon, label, value, href }) => (
            <Link
              key={label}
              href={href}
              className="bg-white/5 rounded-xl p-4 border border-white/5 hover:bg-white/8 transition-all group"
            >
              <Icon size={18} className="text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-xl font-bold text-white">{value}</p>
              <p className="text-xs text-white/40 mt-0.5">{label}</p>
            </Link>
          ))}
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: "/studio/upload",    icon: Upload,   label: "Ajouter un son",  desc: "Uploader un nouveau titre" },
            { href: "/studio/albums",    icon: Disc3,    label: "Mes albums",      desc: "Gérer ta discographie" },
            { href: "/studio/analytics", icon: BarChart2, label: "Analytics",      desc: "Voir tes statistiques" },
          ].map(({ href, icon: Icon, label, desc }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/8 hover:border-purple-500/20 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600/30 transition-colors">
                <Icon size={18} className="text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="text-xs text-white/40">{desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Sons récents */}
        {data.songs.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider">
                Mes sons récents
              </h2>
              <Link
                href="/studio/upload"
                className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                + Ajouter
              </Link>
            </div>
            <SongsList songs={data.songs} />
          </section>
        )}

      </div>
    </div>
  );
}