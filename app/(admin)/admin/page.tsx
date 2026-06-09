import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Song from "@/models/Song";
import Artist from "@/models/Artist";
import Like from "@/models/Like";
import Comment from "@/models/Comment";
import { Header } from "@/components/layout/Header";
import {
  Users, Music2, Mic2, Heart,
  MessageCircle, TrendingUp,
} from "lucide-react";
import Link from "next/link";

async function getStats() {
  await connectDB();

  const [
    totalUsers,
    totalSongs,
    totalArtists,
    totalLikes,
    totalComments,
    recentUsers,
    topSongs,
  ] = await Promise.all([
    User.countDocuments(),
    Song.countDocuments(),
    Artist.countDocuments(),
    Like.countDocuments(),
    Comment.countDocuments(),
    User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email role createdAt")
      .lean(),
    Song.find({ isPublished: true })
      .populate("artist", "name")
      .sort({ streamCount: -1 })
      .limit(5)
      .lean(),
  ]);

  return {
    totalUsers,
    totalSongs,
    totalArtists,
    totalLikes,
    totalComments,
    recentUsers,
    topSongs,
  };
}

export const metadata = { title: "Administration" };

export default async function AdminPage() {
  const stats = await getStats();

  const cards = [
    { icon: Users,         label: "Utilisateurs", value: stats.totalUsers,    href: "/admin/users",   color: "text-blue-400" },
    { icon: Music2,        label: "Sons",          value: stats.totalSongs,    href: "/admin/library", color: "text-purple-400" },
    { icon: Mic2,          label: "Artistes",      value: stats.totalArtists,  href: "/admin/artists", color: "text-pink-400" },
    { icon: Heart,         label: "Likes",         value: stats.totalLikes,    href: "/admin",         color: "text-red-400" },
    { icon: MessageCircle, label: "Commentaires",  value: stats.totalComments, href: "/admin",         color: "text-green-400" },
    { icon: TrendingUp,    label: "Streams",       value: stats.topSongs.reduce((a, s) => a + (s.streamCount ?? 0), 0), href: "/admin", color: "text-yellow-400" },
  ];

  return (
    <div className="pb-32">
      <Header title="Administration" />

      <div className="px-4 md:px-6 py-6 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {cards.map(({ icon: Icon, label, value, href, color }) => (
            <Link
              key={label}
              href={href}
              className="bg-white/5 rounded-xl p-4 border border-white/5 hover:bg-white/8 hover:border-white/10 transition-all group"
            >
              <Icon size={20} className={`${color} mb-3 group-hover:scale-110 transition-transform`} />
              <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
              <p className="text-xs text-white/40 mt-1">{label}</p>
            </Link>
          ))}
        </div>

        {/* Top sons */}
        <section>
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">
            Top 5 sons
          </h2>
          <div className="bg-white/3 rounded-xl border border-white/5 overflow-hidden">
            {stats.topSongs.map((song, i) => (
              <div
                key={song._id.toString()}
                className="flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-0"
              >
                <span className="text-sm text-white/30 w-5 text-right flex-shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {song.title}
                  </p>
                  <p className="text-xs text-white/40">
                    {(song.artist as any)?.name}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-white/40">
                  <TrendingUp size={12} className="text-purple-400" />
                  {song.streamCount?.toLocaleString()} streams
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Utilisateurs récents */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider">
              Utilisateurs récents
            </h2>
            <Link
              href="/admin/users"
              className="text-xs text-purple-400 hover:text-purple-300"
            >
              Voir tout
            </Link>
          </div>
          <div className="bg-white/3 rounded-xl border border-white/5 overflow-hidden">
            {stats.recentUsers.map((user) => (
              <div
                key={user._id.toString()}
                className="flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-0"
              >
                <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-purple-400">
                  {(user.name as string)?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user.name as string}
                  </p>
                  <p className="text-xs text-white/40 truncate">
                    {user.email as string}
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  user.role === "admin"
                    ? "bg-red-500/20 text-red-400"
                    : user.role === "artist"
                    ? "bg-purple-500/20 text-purple-400"
                    : "bg-white/10 text-white/40"
                }`}>
                  {user.role as string}
                </span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}