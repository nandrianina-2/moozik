"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useDropzone } from "react-dropzone";
import {
  Check, Copy, User, AtSign, FileText,
  Camera, Link as LinkIcon, Instagram,
  Twitter, Globe, Lock, Bell, Shield,
  LogOut, Trash2, Crown, ChevronRight,
  Mic2, Eye, EyeOff, Smartphone,
} from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

type Tab = "profile" | "security" | "notifications" | "account";

interface AccountData {
  name: string;
  username: string;
  bio: string;
  email: string;
  image: string;
  coverImage: string;
  isPremium: boolean;
  role: string;
  socialLinks: {
    instagram: string;
    twitter: string;
    website: string;
  };
}

export default function AccountPage() {
  const { user, isArtist, isAdmin } = useCurrentUser();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [form, setForm] = useState<AccountData>({
    name: "", username: "", bio: "", email: "",
    image: "", coverImage: "", isPremium: false, role: "user",
    socialLinks: { instagram: "", twitter: "", website: "" },
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);

  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [passMsg, setPassMsg] = useState("");
  const { user: sessionUser } = useCurrentUser();

  useEffect(() => {
    fetch("/api/users/me")
      .then((r) => r.json())
      .then((d) => {
        setForm({
          name:        d.name ?? "",
          username:    d.username ?? "",
          bio:         d.bio ?? "",
          email:       d.email ?? "",
          image:       d.image ?? "",
          coverImage:  d.coverImage ?? "",
          isPremium:   d.isPremium ?? false,
          role:        d.role ?? "user",
          socialLinks: d.socialLinks ?? { instagram: "", twitter: "", website: "" },
        });
        setLoading(false);
      });
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    if (name.startsWith("social.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function uploadImage(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", "moozik_unsigned");
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: fd }
    );
    if (!res.ok) throw new Error("Upload échoué");
    return (await res.json()).secure_url;
  }

  // Avatar dropzone
  const onDropAvatar = useCallback(async (files: File[]) => {
    if (!files[0]) return;
    setAvatarUploading(true);
    try {
      const url = await uploadImage(files[0]);
      setForm((prev) => ({ ...prev, image: url }));
      await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: url }),
      });
    } finally {
      setAvatarUploading(false);
    }
  }, []);

  const { getRootProps: getAvatarProps, getInputProps: getAvatarInput } =
    useDropzone({
      onDrop: onDropAvatar,
      accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
      maxFiles: 1,
    });

  // Cover dropzone
  const onDropCover = useCallback(async (files: File[]) => {
    if (!files[0]) return;
    setCoverUploading(true);
    try {
      const url = await uploadImage(files[0]);
      setForm((prev) => ({ ...prev, coverImage: url }));
      await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverImage: url }),
      });
    } finally {
      setCoverUploading(false);
    }
  }, []);

  const { getRootProps: getCoverProps, getInputProps: getCoverInput } =
    useDropzone({
      onDrop: onDropCover,
      accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
      maxFiles: 1,
    });

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name:        form.name,
        username:    form.username.toLowerCase().replace(/[^a-z0-9_]/g, ""),
        bio:         form.bio,
        socialLinks: form.socialLinks,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPassMsg("Les mots de passe ne correspondent pas");
      return;
    }
    if (newPassword.length < 6) {
      setPassMsg("Minimum 6 caractères");
      return;
    }
    const res = await fetch("/api/users/me/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    if (res.ok) {
      setPassMsg("✓ Mot de passe modifié");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } else {
      setPassMsg(data.error ?? "Erreur");
    }
    setTimeout(() => setPassMsg(""), 3000);
  }

  function copyProfileLink() {
    if (!form.username) return;
    navigator.clipboard.writeText(`${window.location.origin}/u/${form.username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const tabs: { id: Tab; icon: typeof User; label: string }[] = [
    { id: "profile",       icon: User,   label: "Profil" },
    { id: "security",      icon: Lock,   label: "Sécurité" },
    { id: "notifications", icon: Bell,   label: "Notifications" },
    { id: "account",       icon: Shield, label: "Compte" },
  ];

  if (loading) {
    return (
      <div className="pb-32">
        <Header title="Mon compte" />
        <div className="px-4 md:px-6 py-6 space-y-3 max-w-2xl">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32">
      <Header title="Mon compte" />

      <div className="mx-auto px-4 md:px-6 py-6">

        {/* Cover + Avatar */}
        <div className="relative mb-16 rounded-2xl overflow-hidden">
          {/* Cover */}
          <div
            {...getCoverProps()}
            className="relative h-36 bg-gradient-to-br from-purple-900/60 to-black cursor-pointer group"
          >
            <input {...getCoverInput()} />
            {form.coverImage && (
              <img
                src={form.coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              {coverUploading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Camera size={18} className="text-white" />
                  <span className="text-sm text-white font-medium">
                    Changer la couverture
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Avatar */}
          <div
            {...getAvatarProps()}
            className="absolute -bottom-10 left-4 w-20 h-20 rounded-full border-4 border-[#0a0a0a] bg-purple-600/20 cursor-pointer group overflow-hidden"
          >
            <input {...getAvatarInput()} />
            {form.image ? (
              <img src={form.image} alt={form.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-purple-400">
                {form.name[0]?.toUpperCase()}
              </div>
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              {avatarUploading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Camera size={16} className="text-white" />
              )}
            </div>
          </div>
        </div>

        {/* Badges rôle + premium */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <p className="text-lg font-bold text-white">{form.name}</p>
          {form.isPremium && (
            <span className="flex items-center gap-1 text-xs bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-500/20">
              <Crown size={11} /> Premium
            </span>
          )}
          {form.role === "artist" && (
            <span className="flex items-center gap-1 text-xs bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20">
              <Mic2 size={11} /> Artiste
            </span>
          )}
          {form.role === "admin" && (
            <span className="flex items-center gap-1 text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full border border-red-500/20">
              <Shield size={11} /> Admin
            </span>
          )}
        </div>

        {/* // Après les badges, ajoute les infos artiste si disponibles */}
        {form.role === "artist" && (form as any).artist && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 mb-2">
                <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    {(form as any).artist?.isVerified && (
                    <span className="text-xs text-purple-400">✓ Vérifié</span>
                    )}
                    <span className="text-xs text-white/40">
                    {(form as any).artist?.followersCount?.toLocaleString()} abonnés
                    </span>
                    {(form as any).artist?.genres?.slice(0, 2).map((g: string) => (
                    <span key={g} className="text-xs text-white/25 bg-white/5 px-2 py-0.5 rounded-full">
                        {g}
                    </span>
                    ))}
                </div>
                <Link
                    href={`/artists/${sessionUser?.id}`}
                    className="text-xs text-purple-400/60 hover:text-purple-400 transition-colors mt-0.5 block"
                >
                    Voir mon profil public artiste →
                </Link>
                </div>
            </div>
        )}

        {/* Raccourcis rapides */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {[
            { href: "/favorites", icon: Crown,     label: "Favoris" },
            { href: "/history",   icon: Smartphone, label: "Historique" },
            { href: "/playlists", icon: FileText,   label: "Playlists" },
            ...(isArtist ? [{ href: "/studio", icon: Mic2, label: "Studio" }] : []),
            ...(isAdmin  ? [{ href: "/admin",  icon: Shield, label: "Admin" }] : []),
          ].slice(0, 4).map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/8 transition-all text-sm text-white/60 hover:text-white"
            >
              <Icon size={15} className="text-purple-400 flex-shrink-0" />
              {label}
              <ChevronRight size={13} className="ml-auto text-white/20" />
            </Link>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-6">
          {tabs.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all",
                activeTab === id
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white/70"
              )}
            >
              <Icon size={13} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* ── PROFIL ── */}
        {activeTab === "profile" && (
          <form onSubmit={handleSaveProfile} className="space-y-4">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nom */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/50 uppercase tracking-wider flex items-center gap-1.5">
                  <User size={11} /> Nom
                </label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required
                  maxLength={50}
                  className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Username */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/50 uppercase tracking-wider flex items-center gap-1.5">
                  <AtSign size={11} /> Username
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">@</span>
                  <input
                    name="username"
                    type="text"
                    value={form.username}
                    onChange={handleChange}
                    maxLength={30}
                    placeholder="ton_username"
                    className="w-full h-10 pl-7 pr-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider flex items-center gap-1.5">
                <FileText size={11} /> Bio
              </label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                maxLength={300}
                placeholder="Parle un peu de toi..."
                rows={3}
                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-purple-500 transition-colors resize-none"
              />
              <p className="text-xs text-white/25 text-right">{form.bio.length}/300</p>
            </div>

            {/* Réseaux sociaux */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider flex items-center gap-1.5">
                <LinkIcon size={11} /> Liens
              </label>
              <div className="space-y-2">
                {[
                  { name: "social.instagram", icon: Instagram, placeholder: "instagram.com/ton_compte", label: "Instagram" },
                  { name: "social.twitter",   icon: Twitter,   placeholder: "twitter.com/ton_compte",   label: "Twitter / X" },
                  { name: "social.website",   icon: Globe,     placeholder: "https://ton-site.com",     label: "Site web" },
                ].map(({ name, icon: Icon, placeholder, label }) => (
                  <div key={name} className="relative">
                    <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      name={name}
                      type="text"
                      value={name === "social.instagram"
                        ? form.socialLinks.instagram
                        : name === "social.twitter"
                        ? form.socialLinks.twitter
                        : form.socialLinks.website}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className="w-full h-10 pl-9 pr-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Lien profil public */}
            {form.username && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-purple-500/5 border border-purple-500/20">
                <Link
                  href={`/u/${form.username}`}
                  target="_blank"
                  className="flex-1 text-xs text-purple-400 truncate hover:text-purple-300 transition-colors"
                >
                  /u/{form.username}
                </Link>
                <button
                  type="button"
                  onClick={copyProfileLink}
                  className="p-1.5 rounded-lg text-white/30 hover:text-white/70 transition-all"
                >
                  {copied
                    ? <Check size={14} className="text-green-400" />
                    : <Copy size={14} />}
                </button>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={saving}
            >
              {saved ? <><Check size={16} /> Sauvegardé !</> : "Sauvegarder le profil"}
            </Button>
          </form>
        )}

        {/* ── SÉCURITÉ ── */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <form onSubmit={handleChangePassword} className="space-y-4">
              <h3 className="text-sm font-semibold text-white">
                Changer le mot de passe
              </h3>

              {[
                { label: "Mot de passe actuel", value: currentPassword, setter: setCurrentPassword },
                { label: "Nouveau mot de passe", value: newPassword, setter: setNewPassword },
                { label: "Confirmer le nouveau", value: confirmPassword, setter: setConfirmPassword },
              ].map(({ label, value, setter }) => (
                <div key={label} className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                    {label}
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      required
                      minLength={6}
                      className="w-full h-10 px-3 pr-10 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                    >
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              ))}

              {passMsg && (
                <p className={cn(
                  "text-sm px-3 py-2 rounded-lg",
                  passMsg.startsWith("✓")
                    ? "bg-green-500/10 text-green-400"
                    : "bg-red-500/10 text-red-400"
                )}>
                  {passMsg}
                </p>
              )}

              <Button type="submit" variant="secondary" className="w-full">
                Changer le mot de passe
              </Button>
            </form>

            {/* Sessions actives */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white">
                Session active
              </h3>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <Smartphone size={16} className="text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">Session actuelle</p>
                  <p className="text-xs text-white/40">Navigateur web · Maintenant</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-400" />
              </div>
            </div>
          </div>
        )}

        {/* ── NOTIFICATIONS ── */}
        {activeTab === "notifications" && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white mb-4">
              Préférences de notifications
            </h3>
            {[
              { label: "Nouveaux followers",    desc: "Quand quelqu'un te suit" },
              { label: "Likes sur tes sons",    desc: "Quand quelqu'un like ton contenu" },
              { label: "Commentaires",          desc: "Nouveaux commentaires sur tes sons" },
              { label: "Nouvelles sorties",     desc: "Artistes que tu suis" },
              { label: "Notifications push",    desc: "Sur mobile et bureau" },
            ].map(({ label, desc }) => (
              <div
                key={label}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
              >
                <div>
                  <p className="text-sm font-medium text-white">{label}</p>
                  <p className="text-xs text-white/40">{desc}</p>
                </div>
                <button
                  className="relative w-10 h-5 rounded-full bg-purple-600 transition-colors"
                  aria-label={`Toggle ${label}`}
                >
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ── COMPTE ── */}
        {activeTab === "account" && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white mb-4">
              Gestion du compte
            </h3>

            {/* Email (lecture seule) */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-xs text-white/40 mb-1">Email</p>
              <p className="text-sm text-white font-medium">{form.email}</p>
            </div>

            {/* Plan */}
            <div className={cn(
              "p-4 rounded-xl border",
              form.isPremium
                ? "bg-yellow-500/5 border-yellow-500/20"
                : "bg-white/5 border-white/5"
            )}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/40 mb-1">Plan actuel</p>
                  <p className={cn(
                    "text-sm font-semibold",
                    form.isPremium ? "text-yellow-400" : "text-white"
                  )}>
                    {form.isPremium ? "Premium" : "Gratuit"}
                  </p>
                </div>
                {!form.isPremium && (
                  <Link href="/subscription">
                    <Button variant="primary" size="sm">
                      <Crown size={13} /> Passer Premium
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Déconnexion */}
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-3 w-full p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/8 transition-all text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                <LogOut size={16} className="text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Se déconnecter</p>
                <p className="text-xs text-white/40">Fermer la session actuelle</p>
              </div>
            </button>

            {/* Supprimer compte */}
            <button
              onClick={() => {
                if (confirm("Supprimer définitivement ton compte ? Cette action est irréversible.")) {
                  fetch("/api/users/me", { method: "DELETE" })
                    .then(() => signOut({ callbackUrl: "/login" }));
                }
              }}
              className="flex items-center gap-3 w-full p-4 rounded-xl bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-all text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <Trash2 size={16} className="text-red-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-400">Supprimer le compte</p>
                <p className="text-xs text-white/40">Action irréversible</p>
              </div>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}