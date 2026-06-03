import Link from "next/link";
import { connectDB } from "@/lib/db";
import Song from "@/models/Song";
import Artist from "@/models/Artist";
import {
  Music2, Users, Radio, Headphones,
  ArrowRight, Play, Star,
} from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Moozik — Streaming musical indépendant",
  description: "Découvre et écoute de la musique indépendante. Artistes, playlists, radio intelligente.",
};

async function getStats() {
  await connectDB();
  const [totalSongs, totalArtists] = await Promise.all([
    Song.countDocuments({ isPublished: true }),
    Artist.countDocuments(),
  ]);
  return { totalSongs, totalArtists };
}

async function getFeatured() {
  await connectDB();
  const [songs, artists] = await Promise.all([
    Song.find({ isPublished: true })
      .populate("artist", "name slug image isVerified")
      .sort({ streamCount: -1 })
      .limit(6)
      .lean(),
    Artist.find({ isVerified: true })
      .sort({ followersCount: -1 })
      .limit(6)
      .lean(),
  ]);
  return { songs, artists };
}

export default async function LandingPage() {
  const [{ totalSongs, totalArtists }, { songs, artists }] =
    await Promise.all([getStats(), getFeatured()]);

  return (
    <div className="min-h-dvh bg-[#0a0a0a] text-white overflow-x-hidden">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
            <Music2 size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold">Moozik</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            Connexion
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-sm font-medium text-white transition-colors"
          >
            Commencer
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-dvh text-center px-6 pt-20">
        {/* Fond animé */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-600/15 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs text-purple-400 font-medium mb-6">
            <Star size={11} />
            Plateforme de streaming indépendant
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            La musique indépendante{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              sans limites
            </span>
          </h1>

          <p className="text-lg text-white/50 mb-8 max-w-xl mx-auto leading-relaxed">
            Découvre des artistes indépendants, crée tes playlists,
            écoute la radio intelligente et supporte les créateurs directement.
          </p>

          <div className="flex items-center gap-3 justify-center flex-wrap">
            <Link
              href="/register"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95"
            >
              <Play size={16} fill="white" />
              Écouter gratuitement
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium text-white transition-all"
            >
              Se connecter
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Music2,      label: "Sons",          value: totalSongs.toLocaleString() },
            { icon: Users,       label: "Artistes",      value: totalArtists.toLocaleString() },
            { icon: Radio,       label: "Radio 24/7",    value: "∞" },
            { icon: Headphones,  label: "Écoutes/jour",  value: "1K+" },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-white/5 border border-white/5"
            >
              <Icon size={20} className="text-purple-400" />
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-white/40">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Artistes vedettes */}
      {artists.length > 0 && (
        <section className="px-6 py-12 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Artistes vérifiés</h2>
            <Link
              href="/login"
              className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
            >
              Voir tout <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {artists.map((artist) => (
              <div
                key={(artist._id as any).toString()}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden bg-white/10 ring-2 ring-white/5">
                  {artist.image ? (
                    <Image
                      src={artist.image as string}
                      alt={artist.name as string}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20 font-bold text-xl">
                      {(artist.name as string)[0]}
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-white truncate max-w-[80px]">
                    {artist.name as string}
                  </p>
                  {artist.isVerified && (
                    <p className="text-[10px] text-purple-400">✓ Vérifié</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Features */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10">
          Tout ce dont tu as besoin
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: "🎵",
              title: "Lecteur avancé",
              desc: "Waveform, égaliseur, file d'attente, commentaires horodatés",
            },
            {
              icon: "📻",
              title: "Radio intelligente",
              desc: "Algorithme basé sur tes goûts, découverte automatique",
            },
            {
              icon: "🎤",
              title: "Espace artiste",
              desc: "Upload, analytics, gestion des albums et revenus",
            },
            {
              icon: "❤️",
              title: "Playlists sociales",
              desc: "Crée, partage et découvre les playlists de la communauté",
            },
            {
              icon: "📱",
              title: "PWA Mobile",
              desc: "Installe l'app, écoute offline, notifications push",
            },
            {
              icon: "🔒",
              title: "Premium",
              desc: "Qualité audio haute, téléchargement offline, sans publicité",
            },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="p-5 rounded-2xl bg-white/3 border border-white/5 hover:bg-white/5 transition-colors"
            >
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-xl mx-auto p-8 rounded-3xl bg-gradient-to-br from-purple-900/40 to-pink-900/20 border border-purple-500/20">
          <h2 className="text-2xl font-bold text-white mb-3">
            Prêt à découvrir ?
          </h2>
          <p className="text-white/50 text-sm mb-6">
            Rejoins la communauté Moozik gratuitement
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95"
          >
            <Music2 size={16} />
            Créer un compte gratuit
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-md bg-purple-600 flex items-center justify-center">
            <Music2 size={12} className="text-white" />
          </div>
          <span className="text-sm font-bold text-white">Moozik</span>
        </div>
        <p className="text-xs text-white/25">
          © {new Date().getFullYear()} Moozik · Streaming musical indépendant
        </p>
      </footer>

    </div>
  );
}