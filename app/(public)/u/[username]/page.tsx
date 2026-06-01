import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Playlist from "@/models/Playlist";
import Like from "@/models/Like";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { ProfileClient } from "./ProfileClient";
import {
  Crown, ListMusic, Heart,
  Calendar, Shield, Mic2,
} from "lucide-react";
import Link from "next/link";
import { formatCount } from "@/lib/utils";

async function getData(username: string) {
  await connectDB();

  const user = await User.findOne({ username }).lean();
  if (!user) return null;

  const [playlists, likesCount] = await Promise.all([
    Playlist.find({ user: user._id, isPublic: true })
      .sort({ createdAt: -1 })
      .limit(12)
      .lean(),
    Like.countDocuments({ user: user._id }),
  ]);

  return {
    profile: {
      id:        (user._id as any).toString(),
      name:      user.name as string,
      username:  (user as any).username as string,
      image:     user.image as string | undefined,
      bio:       (user as any).bio as string | undefined,
      isPremium: user.isPremium as boolean,
      role:      user.role as string,
      createdAt: new Date(user.createdAt),
      likesCount,
    },
    playlists: playlists.map((p) => ({
      id:         (p._id as any).toString(),
      name:       p.name as string,
      description: p.description as string | undefined,
      songsCount: (p.songs as any[]).length,
    })),
  };
}

export async function generateMetadata(
  { params }: { params: Promise<{ username: string }> }
): Promise<Metadata> {
  const { username } = await params;
  const data = await getData(username);
  if (!data) return { title: "Profil introuvable" };
  return {
    title: `${data.profile.name} (@${data.profile.username})`,
    description: data.profile.bio ?? `Profil de ${data.profile.name} sur Moozik`,
  };
}

export default async function UserProfilePage(
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const data = await getData(username);
  if (!data) notFound();

  const { profile, playlists } = data;

  const roleLabel = profile.role === "admin"
    ? { label: "Admin", icon: Shield, color: "text-red-400 bg-red-400/10" }
    : profile.role === "artist"
    ? { label: "Artiste", icon: Mic2, color: "text-purple-400 bg-purple-400/10" }
    : null;

  return (
    <div className="pb-32">
      <Header title="Profil" />

      <div className="px-4 md:px-6 py-6 max-w-2xl">

        {/* Avatar + infos */}
        <div className="flex items-start gap-4 mb-8">
          <div className="w-20 h-20 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0 text-3xl font-bold text-purple-400 overflow-hidden">
            {profile.image ? (
              <img
                src={profile.image}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              profile.name[0]?.toUpperCase()
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-white">{profile.name}</h1>
              {profile.isPremium && (
                <span className="flex items-center gap-1 text-xs bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded-full">
                  <Crown size={11} />
                  Premium
                </span>
              )}
              {roleLabel && (
                <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${roleLabel.color}`}>
                  <roleLabel.icon size={11} />
                  {roleLabel.label}
                </span>
              )}
            </div>

            {profile.username && (
              <p className="text-sm text-white/40 mt-0.5">
                @{profile.username}
              </p>
            )}

            {profile.bio && (
              <p className="text-sm text-white/60 mt-2 leading-relaxed">
                {profile.bio}
              </p>
            )}

            <div className="flex items-center gap-4 mt-3 text-xs text-white/30">
              <span className="flex items-center gap-1">
                <Heart size={12} className="text-pink-400" />
                {formatCount(profile.likesCount)} likes
              </span>
              <span className="flex items-center gap-1">
                <ListMusic size={12} className="text-purple-400" />
                {playlists.length} playlist{playlists.length > 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                Depuis {profile.createdAt.toLocaleDateString("fr-FR", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Playlists publiques */}
        {playlists.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">
              Playlists publiques
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {playlists.map((playlist) => (
                <Link
                  key={playlist.id}
                  href={`/playlists/${playlist.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/8 hover:border-purple-500/20 transition-all group"
                >
                  <div className="w-12 h-12 rounded-lg bg-purple-600/20 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600/30 transition-colors">
                    <ListMusic size={20} className="text-purple-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {playlist.name}
                    </p>
                    {playlist.description && (
                      <p className="text-xs text-white/40 truncate mt-0.5">
                        {playlist.description}
                      </p>
                    )}
                    <p className="text-xs text-white/30 mt-0.5">
                      {playlist.songsCount} son{playlist.songsCount > 1 ? "s" : ""}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {playlists.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center">
              <ListMusic size={24} className="text-white/20" />
            </div>
            <p className="text-white/30 text-sm">
              Aucune playlist publique
            </p>
          </div>
        )}

      </div>
    </div>
  );
}