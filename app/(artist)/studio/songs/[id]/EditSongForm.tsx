"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import {
  ChevronLeft, Save, Image as ImageIcon,
  X, Check, Loader2, Eye, EyeOff, Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn, slugify } from "@/lib/utils";
import Link from "next/link";

type Genre =
  | "Electronic" | "Hip-Hop" | "R&B" | "Pop" | "Rock"
  | "Jazz" | "Soul" | "Afrobeat" | "Reggae" | "Classical"
  | "Synthwave" | "Alternative" | "Indie" | "Dance";

const GENRES: Genre[] = [
  "Electronic", "Hip-Hop", "R&B", "Pop", "Rock",
  "Jazz", "Soul", "Afrobeat", "Reggae", "Classical",
  "Synthwave", "Alternative", "Indie", "Dance",
];

interface SongData {
  id: string;
  title: string;
  coverUrl?: string;
  genres: string[];
  lyrics?: string;
  isPublished: boolean;
  releaseDate: string;
  scheduledAt: string;
}

type SaveStep = "idle" | "saving" | "success" | "error";

export function EditSongForm({ song }: { song: SongData }) {
  const router = useRouter();
  const [saveStep, setSaveStep] = useState<SaveStep>("idle");

  const [title, setTitle] = useState(song.title);
  const [genres, setGenres] = useState<string[]>(song.genres);
  const [lyrics, setLyrics] = useState(song.lyrics ?? "");
  const [isPublished, setIsPublished] = useState(song.isPublished);
  const [releaseDate, setReleaseDate] = useState(song.releaseDate);
  const [coverUrl, setCoverUrl] = useState(song.coverUrl ?? "");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(
    song.coverUrl ?? null
  );

  const today = new Date().toISOString().split("T")[0];

  const onDropCover = useCallback((files: File[]) => {
    if (files[0]) {
      setCoverFile(files[0]);
      setCoverPreview(URL.createObjectURL(files[0]));
    }
  }, []);

  const { getRootProps: getCoverProps, getInputProps: getCoverInput } =
    useDropzone({
      onDrop: onDropCover,
      accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
      maxFiles: 1,
    });

  function toggleGenre(g: string) {
    setGenres((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  }

  async function uploadCover(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", "moozik_unsigned");
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: fd }
    );
    if (!res.ok) throw new Error("Upload cover échoué");
    return (await res.json()).secure_url;
  }

  async function handleSave() {
    if (!title.trim()) return;
    setSaveStep("saving");

    try {
      let finalCoverUrl = coverUrl;
      if (coverFile) {
        finalCoverUrl = await uploadCover(coverFile);
      }

      const res = await fetch(`/api/songs/${song.id}/edit`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title:       title.trim(),
          coverUrl:    finalCoverUrl || undefined,
          genres,
          lyrics:      lyrics.trim() || undefined,
          isPublished,
          releaseDate: releaseDate ? new Date(releaseDate).toISOString() : undefined,
        }),
      });

      if (!res.ok) throw new Error("Erreur sauvegarde");

      setSaveStep("success");
      setTimeout(() => router.push("/studio"), 1500);
    } catch {
      setSaveStep("error");
      setTimeout(() => setSaveStep("idle"), 3000);
    }
  }

  async function handleDelete() {
    if (!confirm("Supprimer ce son définitivement ? Cette action est irréversible.")) return;

    await fetch(`/api/songs/${song.id}`, { method: "DELETE" });
    router.push("/studio");
  }

  return (
    <div className="px-4 md:px-6 py-6">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/studio"
            className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors"
          >
            <ChevronLeft size={16} />
            Retour
          </Link>

          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 text-xs text-red-400/60 hover:text-red-400 transition-colors"
          >
            <Trash2 size={14} />
            Supprimer
          </button>
        </div>

        <div className="space-y-5">

          {/* Cover */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">
              Cover
            </label>
            <div className="flex items-center gap-4">
              {coverPreview ? (
                <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={coverPreview}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCoverFile(null);
                      setCoverPreview(null);
                      setCoverUrl("");
                    }}
                    className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center text-white"
                  >
                    <X size={11} />
                  </button>
                </div>
              ) : (
                <div
                  {...getCoverProps()}
                  className="flex flex-col items-center justify-center gap-2 w-24 h-24 rounded-xl border-2 border-dashed border-white/10 hover:border-white/20 cursor-pointer transition-all hover:bg-white/3 flex-shrink-0"
                >
                  <input {...getCoverInput()} />
                  <ImageIcon size={20} className="text-white/25" />
                  <p className="text-[10px] text-white/30 text-center">
                    Changer
                  </p>
                </div>
              )}
              <div
                {...getCoverProps()}
                className="flex-1 h-12 flex items-center px-3 rounded-xl border border-dashed border-white/10 hover:border-white/20 cursor-pointer transition-all text-xs text-white/30 hover:text-white/50"
              >
                <input {...getCoverInput()} />
                <ImageIcon size={14} className="mr-2" />
                Cliquer ou glisser une nouvelle image
              </div>
            </div>
          </div>

          {/* Titre */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">
              Titre <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={100}
              className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
            />
          </div>

          {/* Date de sortie */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">
              Date de sortie
            </label>
            <input
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              max={today}
              className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors [color-scheme:dark]"
            />
            <p className="text-xs text-white/25 pl-1">
              Utilisé pour catégoriser par année
            </p>
          </div>

          {/* Visibilité */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">
              Visibilité
            </label>
            <button
              type="button"
              onClick={() => setIsPublished((prev) => !prev)}
              className={cn(
                "flex items-center justify-between w-full px-4 py-3 rounded-xl border transition-all",
                isPublished
                  ? "bg-green-500/10 border-green-500/20"
                  : "bg-white/5 border-white/10"
              )}
            >
              <div className="flex items-center gap-2.5">
                {isPublished ? (
                  <Eye size={16} className="text-green-400" />
                ) : (
                  <EyeOff size={16} className="text-white/30" />
                )}
                <div className="text-left">
                  <p className={cn(
                    "text-sm font-medium",
                    isPublished ? "text-green-400" : "text-white/50"
                  )}>
                    {isPublished ? "Publié" : "Dépublié"}
                  </p>
                  <p className="text-xs text-white/30">
                    {isPublished
                      ? "Visible par tous les utilisateurs"
                      : "Masqué — seul toi peux le voir"}
                  </p>
                </div>
              </div>
              <div className={cn(
                "relative w-10 h-5 rounded-full transition-colors flex-shrink-0",
                isPublished ? "bg-green-600" : "bg-white/20"
              )}>
                <span className={cn(
                  "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform",
                  isPublished ? "translate-x-5" : "translate-x-0"
                )} />
              </div>
            </button>
          </div>

          {/* Genres */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">
              Genres
            </label>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => toggleGenre(g)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                    genres.includes(g)
                      ? "bg-purple-600 border-purple-600 text-white"
                      : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
                  )}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Paroles */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">
              Paroles{" "}
              <span className="text-white/25 normal-case font-normal">
                (optionnel)
              </span>
            </label>
            <textarea
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              placeholder="Paroles du son..."
              rows={6}
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-purple-500 transition-colors resize-none"
            />
          </div>

          {/* Bouton save */}
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleSave}
            loading={saveStep === "saving"}
            disabled={!title.trim() || saveStep === "saving"}
          >
            {saveStep === "success" ? (
              <><Check size={16} /> Sauvegardé !</>
            ) : saveStep === "error" ? (
              <><X size={16} /> Erreur — réessaie</>
            ) : (
              <><Save size={16} /> Sauvegarder</>
            )}
          </Button>

        </div>
      </div>
    </div>
  );
}